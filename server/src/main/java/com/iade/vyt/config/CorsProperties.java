package com.iade.vyt.config;

import lombok.Data;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "cors")
@Getter
public class CorsProperties {
    private String originHost;
    private String allowedMethods;
    private String addMap;
}