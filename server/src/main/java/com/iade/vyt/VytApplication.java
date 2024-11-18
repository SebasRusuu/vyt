package com.iade.vyt;

import com.iade.vyt.filters.AuthFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "com.iade.vyt")
public class VytApplication {
	public static void main(String[] args) {
		SpringApplication.run(VytApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean<AuthFilter> filterRegistrationBean(){
		FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();
		AuthFilter authFilter = new AuthFilter();
		registrationBean.setFilter(authFilter);
		registrationBean.addUrlPatterns("/api/tarefa/*");
		registrationBean.addUrlPatterns("/api/horario/*");
		registrationBean.addUrlPatterns("/api/feedback/*");
		return registrationBean;
	}
}

