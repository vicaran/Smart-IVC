package com.app.commands;

import com.app.models.City;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.utils.creators.CityCreator;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Created by Andrea on 14/04/2017.
 */
@Service
public class CityLoaderCommand {

    private final BuildingRepository buildingRepository;
    private final CityRepository cityRepository;
    private final AddressRepository addressRepository;

    public CityLoaderCommand(BuildingRepository buildingRepository, CityRepository cityRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
    }

    @Scheduled
    public void loadLuganoTask() {
        Optional<City> cityLugano = this.cityRepository.findCityByName("Lugano");
        if (!cityLugano.isPresent()) {
            System.out.println("Loading Lugano data...");
            CityCreator lugano = new CityCreator();
            try {
                lugano = new CityCreator("src/main/resources/city_data/lugano.xml", "Lugano", "6900");
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (lugano.getCityModel() != null) {
                this.saveModels(lugano);
            }

        } else {
            System.out.println("Lugano already loaded!");
        }
    }

    private void saveModels(CityCreator city) {
        this.cityRepository.save(city.getCityModel());
        this.buildingRepository.save(city.getBuildingList());
        this.addressRepository.save(city.getAddressList());
        System.out.println("Lugano data loaded!");
    }
}
