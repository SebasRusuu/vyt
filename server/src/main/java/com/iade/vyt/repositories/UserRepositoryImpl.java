package com.iade.vyt.repositories;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.Objects;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    public static final int LOG_ROUNDS = 10;

    private static final String SQL_CREATE = "INSERT INTO uservyt(user_name, email, password_hash) VALUES(?, ?, ?)";
    private static final String SQL_COUNT_BY_EMAIL = "SELECT COUNT(*) FROM uservyt WHERE email = ?";
    private static final String SQL_FIND_BY_ID = "SELECT user_id, user_name, email, password_hash FROM uservyt WHERE user_id = ?";
    private static final String SQL_FIND_BY_EMAIL = "SELECT user_id, user_name, email, password_hash FROM uservyt WHERE email = ?";

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Integer create(String user_name, String email, String password_hash) throws EtAuthException {
        String hashedPassword = BCrypt.hashpw(password_hash, BCrypt.gensalt(LOG_ROUNDS));
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE, new String[]{"user_id"});
                ps.setString(1, user_name);
                ps.setString(2, email);
                ps.setString(3, hashedPassword);
                return ps;
            }, keyHolder);
            return Objects.requireNonNull(keyHolder.getKey()).intValue();
        } catch (Exception e) {
            throw new EtAuthException("Invalid details. Failed to create account: " + e.getMessage());
        }
    }

    @Override
    public User findByEmailAndPassword(String email, String password) throws EtAuthException {
        try {
            User user = jdbcTemplate.queryForObject(SQL_FIND_BY_EMAIL, new Object[]{email}, userRowMapper);
            if (!BCrypt.checkpw(password, user.getPasswordHash())) {
                throw new EtAuthException("Invalid email/password");
            }
            return user;
        } catch (EmptyResultDataAccessException e) {
            throw new EtAuthException("Invalid email/password");
        }
    }

    @Override
    public Integer getCountByEmail(String email) {
        try {
            Integer count = jdbcTemplate.queryForObject(SQL_COUNT_BY_EMAIL, new Object[]{email}, Integer.class);
            return count;
        } catch (Exception e) {
            System.err.println("Erro ao executar a consulta SQL: " + e.getMessage());
            return 0;
        }
    }


    @Override
    public Optional<User> findById(Integer userId) {
        try {
            User user = jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new Object[]{userId}, userRowMapper);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }



    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getInt("user_id"),
            rs.getString("user_name"),
            rs.getString("email"),
            rs.getString("password_hash")
    );
}
