package com.app;

import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.repositories.SuburbRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The type Smart ivc application.
 */
@SpringBootApplication
public class SmartIvcApplication implements CommandLineRunner{

	private final BuildingRepository buildingRepository;
	private final CityRepository cityRepository;
	private final SuburbRepository suburbRepository;

    /**
     * Instantiates a new Smart ivc application.
     *
     * @param buildingRepository the building repository
     * @param cityRepository     the city repository
     * @param suburbRepository   the suburb repository
     */
    @Autowired
	public SmartIvcApplication(BuildingRepository buildingRepository, CityRepository cityRepository, SuburbRepository suburbRepository) {
		this.buildingRepository = buildingRepository;
		this.cityRepository = cityRepository;
		this.suburbRepository = suburbRepository;
	}

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     * @throws Exception the exception
     */
    public static void main(String[] args) throws Exception {
		SpringApplication.run(SmartIvcApplication.class, args);
	}

	public void run(String... var1) throws Exception {
//		ScheduledTasks scheduledTasks = new ScheduledTasks(buildingRepository, cityRepository, suburbRepository);
//		scheduledTasks.converterTask();
	}


//	https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=46.007639,8.958633&radius=500&key=AIzaSyCY1ov7-HWE-CahFZyIjaGOQYGYK-T8wls

//	https://maps.googleapis.com/maps/api/elevation/json?locations=46.002290879,8.938280135&key=AIzaSyCY1ov7-HWE-CahFZyIjaGOQYGYK-T8wls

}
