package com.iade.vyt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.iade.vyt")
public class VytApplication {
	public static void main(String[] args) {
		SpringApplication.run(VytApplication.class, args);
	}
}

