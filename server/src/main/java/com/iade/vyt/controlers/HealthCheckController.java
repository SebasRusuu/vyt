package com.iade.vyt.controlers;

import com.iade.vyt.services.DataSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.SQLException;

import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@RestController
public class HealthCheckController {

    private static final int CONNECTION_VALIDITY_TIMEOUT = 2;

    @Autowired
    private DataSourceService dataSourceService;

    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck() {
        try (Connection connection = dataSourceService.getDataSource().getConnection()) {
            if (connection.isValid(CONNECTION_VALIDITY_TIMEOUT)) {
                dataSourceService.refreshConnectionPool();
                return ResponseEntity.ok("Master is back online");
            } else {
                return ResponseEntity.status(SERVICE_UNAVAILABLE).body("Master is not available");
            }
        } catch (SQLException e) {
            return ResponseEntity.status(SERVICE_UNAVAILABLE).body("Master is not available");
        }
    }
}