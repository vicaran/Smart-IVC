package com.app;

import com.app.utils.Parser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartIvcApplication {

	public static void main(String[] args) throws Exception {
		SpringApplication.run(SmartIvcApplication.class, args);
//		Parser parser = new Parser("src/main/resources/city_data/lugano.xml");
//		parser.createCity();
//		parser.printCity();
	}
}
