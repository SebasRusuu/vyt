package com.iade.vyt.repositories;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final static String SQL_CREATE = "INSERT INTO userVyT(user_id, user_name, email, password_hash) VALUES(NEXTVAL('ET_USER_SEQ'), ?, ?, ?)";
    private final static String SQL_COUNT_BY_EMAIL = "SELECT COUNT(*) FROM userVyT WHERE email = ?";
    private final static String SQL_FIND_BY_ID = "SELECT user_id, user_name, email, password_hash FROM userVyT WHERE user_id = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public Integer create(String user_name, String email, String password_hash) throws EtAuthException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE, new String[]{"user_id"});
                ps.setString(1, user_name);
                ps.setString(2, email);
                ps.setString(3, password_hash);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("user_id");
        } catch (Exception e) {
            throw new EtAuthException("Invalid details. Failed to create account");
        }
    }

    @Override
    public User findByEmailAndPassword(String email, String password) throws EtAuthException {
        return null;
    }

    @Override
    public final Integer getCountByEmail(String email) {
        return jdbcTemplate.queryForObject(SQL_COUNT_BY_EMAIL, new Object[]{email}, Integer.class);
    }

    @Override
    public User findById(Integer userId) {
        return jdbcTemplate.queryForObject(SQL_FIND_BY_ID, new Object[]{userId}, userRowMapper);
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(rs.getInt("user_id"),
            rs.getString("user_name"),
            rs.getString("email"),
            rs.getString("password_hash"));
}