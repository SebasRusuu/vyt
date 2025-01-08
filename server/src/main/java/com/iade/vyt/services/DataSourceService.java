package com.iade.vyt.services;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

@Service
public class DataSourceService {

    @Autowired
    private DataSource dataSource;

    public DataSource getDataSource() {
        return dataSource;
    }

    public void refreshConnectionPool() {
        if (dataSource instanceof HikariDataSource) {
            ((HikariDataSource) dataSource).getHikariPoolMXBean().softEvictConnections();
        }
    }
}