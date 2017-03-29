package com.app;

import com.app.models.Building;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.utils.Converter;
import com.app.utils.creators.CityCreator;

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
//		this.loadLugano("src/main/resources/city_data/lugano.xml");
	}

	private void loadLugano(String cityPath) throws Exception {
		CityCreator lugano = new CityCreator(cityPath, "Lugano", "6900");

		this.cityRepository.save(lugano.getCityModel());

		for (Building building : lugano.getBuildingList()) {
			this.buildingRepository.save(building);
		}
	}
//	https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=46.007639,8.958633&radius=500&key=AIzaSyCY1ov7-HWE-CahFZyIjaGOQYGYK-T8wls


}
