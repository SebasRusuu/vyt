package com.iade.vyt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

@SpringBootApplication(scanBasePackages = "com.iade.vyt")
public class VytApplication {
	public static void main(String[] args) {
		// Load .env file
		loadEnvFile();

		// Run the application
		SpringApplication.run(VytApplication.class, args);
	}

	private static void loadEnvFile() {
		try (Stream<String> lines = Files.lines(Paths.get(".env"))) {
			lines.forEach(line -> {
				String[] parts = line.split("=", 2);
				if (parts.length == 2) {
					System.setProperty(parts[0].trim(), parts[1].trim());
					System.out.println("Loaded env: " + parts[0].trim());
				}
			});
		} catch (IOException e) {
			System.err.println("Failed to load .env file: " + e.getMessage());
		}
	}
}
