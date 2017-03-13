package com.app;

import com.app.models.Building;
import com.app.models.City;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.utils.Parser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class SmartIvcApplication implements CommandLineRunner{

	private final BuildingRepository buildingRepository;
	private final CityRepository cityRepository;

	@Autowired
	public SmartIvcApplication(BuildingRepository buildingRepository, CityRepository cityRepository) {
		this.buildingRepository = buildingRepository;
		this.cityRepository = cityRepository;
	}

	public static void main(String[] args) throws Exception {
		SpringApplication.run(SmartIvcApplication.class, args);
	}

	public void run(String... var1) throws Exception {
		Parser parser = new Parser("src/main/resources/city_data/lugano.xml");
		City luganoCity = new City("Lugano", "6900", "Switzerland");
		this.cityRepository.save(luganoCity);
		List<Building> city = parser.createCity();
		this.buildingRepository.save(city.get(0));
	}
}
