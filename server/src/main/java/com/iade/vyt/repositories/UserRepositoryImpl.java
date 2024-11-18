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

@Repository
public class UserRepositoryImpl implements UserRepository {

    public final static int LOG_ROUNDS = 10;

    // SQL Statements
    private final static String SQL_CREATE = "INSERT INTO userVyT(user_name, email, password_hash) VALUES(?, ?, ?)";
    private final static String SQL_COUNT_BY_EMAIL = "SELECT COUNT(*) FROM userVyT WHERE email = ?";
    private final static String SQL_FIND_BY_ID = "SELECT user_id, user_name, email, password_hash FROM userVyT WHERE user_id = ?";
    private final static String SQL_FIND_BY_EMAIL = "SELECT user_id, user_name, email, password_hash FROM userVyT WHERE email = ?";

    // Injeção do JdbcTemplate
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
            return Objects.requireNonNull(keyHolder.getKey()).intValue(); // Retorna o ID gerado
        } catch (Exception e) {
            throw new EtAuthException("Invalid details. Failed to create account: " + e.getMessage());
        }
    }

    @Override
    public User findByEmailAndPassword(String email, String password) throws EtAuthException {
        try {
            User user = jdbcTemplate.queryForObject(SQL_FIND_BY_EMAIL, new Object[]{email}, userRowMapper);
            if(!BCrypt.checkpw(password, user.getPasswordHash())) {
                throw new EtAuthException("Invalid email/password");
            }
            return user;
        } catch (EmptyResultDataAccessException e) {
            throw new EtAuthException("Invalid email/password");
        }
    }


    @Override
    public Integer getCountByEmail(String email) {
        return jdbcTemplate.queryForObject(SQL_COUNT_BY_EMAIL, new Object[]{email}, Integer.class);
    }

    @Override
    public User findById(Integer userId) {
        return jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new Object[]{userId}, userRowMapper);
    }

    // Mapeador de linhas para a entidade User
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getInt("user_id"),
            rs.getString("user_name"),
            rs.getString("email"),
            rs.getString("password_hash")
    );
}
