package com.app.commands;

import com.app.API.OpenStreetMap.LocationInfo;
import com.app.API.OpenStreetMap.OpenStreetMapAPIServices;
import com.app.API.SwissTopo.SwissTopoAPIServices;
import com.app.API.SwissTopo.SwissTopoConverter;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.City;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.repositories.SuburbRepository;
import com.app.utils.creators.CityCreator;
import com.app.utils.dataStructures.Pair;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Andrea on 29/03/2017.
 */
@Service
public class ScheduledTasks {

    private Timer updateTimer;
    private final BuildingRepository buildingRepository;
    private SwissTopoAPIServices swissTopo;
    private final CityRepository cityRepository;
    private final SuburbRepository suburbRepository;
    private final AddressRepository addressRepository;

    public ScheduledTasks(BuildingRepository buildingRepository, CityRepository cityRepository, SuburbRepository suburbRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.cityRepository = cityRepository;
        this.suburbRepository = suburbRepository;
        this.addressRepository = addressRepository;
        this.swissTopo = new SwissTopoConverter();
        updateTimer = new Timer();

        TimerTask myConverterTask = new TimerTask() {
            @Override
            public void run() {
                converterTask();
            }
        };
        TimerTask myInformationTask = new TimerTask() {
            @Override
            public void run() {
                informationTask();
            }
        };
        TimerTask myLoadLuganoTask = new TimerTask() {
            @Override
            public void run() {
                loadLuganoTask();
            }
        };

        updateTimer.schedule(myConverterTask, 20000);
//        updateTimer.schedule(myInformationTask, 30000, 86460000);
//        updateTimer.schedule(myInformationTask, 10000);
        updateTimer.schedule(myLoadLuganoTask, 5000);
    }


    @Scheduled
    public void converterTask() {
        System.out.println("Converting Swiss to Global coordinates...");
        List<Building> buildings = this.buildingRepository.findBuildingsByOwnCityCountry("Switzerland");
        boolean ringUpdated = false;
        boolean centroidUpdated = false;

        for (Building building : buildings) {
            // Convert Ring from CH to Global Coordinates
            if (building.getRingGlobalCoords() == null) {
                ringUpdated = true;
                building = convertRingCHtoWGS(building);
            }

            // Convert Centroid
            List<Address> addresses = new ArrayList<>();
            if (building.getCentroidLat() >= 90 && building.getCentroidLng() >= 180) {
                centroidUpdated = true;
                building = this.convertCentroidCHtoWGS(building);
                List<Address> buildingAddresses = new ArrayList<>();
                for (Address address : building.getAddresses()){
                    Address convertedResult = convertAddressCHtoWGS(address);
                    buildingAddresses.add(convertedResult);
                    addresses.add(convertedResult);
                }
                building.setAddresses(buildingAddresses);
            }

            // Save updated values
            if (ringUpdated || centroidUpdated) {
                buildingRepository.save(building);
                addressRepository.save(addresses);
                System.out.println("Building " + building.getId() + " saved!");
            }
        }
        System.out.println("Ring Coordinates Updated from SwissTopo: " + ringUpdated + ".");
        System.out.println("Centroid Coordinates Updated SwissTopo: " + centroidUpdated + ".");
    }

    @Scheduled
    public void informationTask() {
        List<Building> buildings = this.buildingRepository.findAll();
        OpenStreetMapAPIServices services = new LocationInfo();
//        HashMap<String, String> result = services.buildingInfo(buildings.get(1).getCentroidLat(), buildings.get(1).getCentroidLng(), buildings.get(1).getId());

        for (Building building : buildings) {
            if (building.getId() > 6852) {
                HashMap<String, String> result = services.buildingInfo(building.getCentroidLat(), building.getCentroidLng(), building.getId());
//
                System.out.println("Result produced for building: " + building.getId());
            }
//

//            System.out.println(result.toString());
//            City city = new City();

//            if(result.get("townName") != null){
//                Optional<City> resultCity = cityRepository.findCityByName(result.get("townName"));
//
//                if (resultCity.isPresent()) {
//                    city = resultCity.get();
//                } else {
//                    city.setName(result.get("townName"));
//                    //TODO INITIALIZE NEW CITY
//                }
//            }

//            Suburb suburb = new Suburb();
//            if(result.get("suburbName") != null) {
//                Optional<Suburb> resultSuburb = suburbRepository.findSuburbByName(result.get("suburbName"));
//
//                if (resultSuburb.isPresent()) {
//                    suburb = resultSuburb.get();
//                } else {
//                    //TODO INITIALIZE NEW SUBURB
//                }
//            }

//            Address address = new Address();
//            if(result.get("roadName") != null) {
//                address.setAddressName(result.get("roadName"));
//            }
//            if(result.get("house_numberName") != null) {
//                address.setHouseNumber(result.get("house_numberName"));
//            }
//
//            building.addAddress(address);
//            buildingRepository.save(building);
//
//            suburb.addBuilding(building);
//            suburbRepository.save(suburb);
//
//            city.addSuburb(suburb);
//            cityRepository.save(city);


        }
    }

    private Building convertRingCHtoWGS(Building building) {
        String globalCoordinates = "";
        String swissCoords = new String(building.getRingSwissCoords(), StandardCharsets.UTF_8);
        String[] points = swissCoords.split(",");

        for (String point : points) {
            String[] pointNE = point.split(" ");
            Pair<Double, Double> convertedCoords = this.swissTopo.CHtoWGS(Double.parseDouble(pointNE[0]), Double.parseDouble(pointNE[1]));
            globalCoordinates += convertedCoords.getL() + " " + convertedCoords.getR() + ",";
        }
        if (globalCoordinates.length() > 0) {
            globalCoordinates = globalCoordinates.substring(0, globalCoordinates.length() - 1);
        }

        building.setRingGlobalCoords(globalCoordinates.getBytes());
        return building;
    }

    private Building convertCentroidCHtoWGS(Building building) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(building.getCentroidLat(), building.getCentroidLng());
        building.setCentroidLat(convertedCentroid.getL());
        building.setCentroidLng(convertedCentroid.getR());
        return building;
    }

    private Address convertAddressCHtoWGS(Address address) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(address.getLatitude(), address.getLongitude());
        address.setLatitude(convertedCentroid.getL());
        address.setLongitude(convertedCentroid.getR());
        return address;
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
            if(lugano.getCityModel() != null){
                this.cityRepository.save(lugano.getCityModel());
                this.buildingRepository.save(lugano.getBuildingList());
                this.addressRepository.save(lugano.getAddressList());
            }
            System.out.println("Lugano data loaded!");
        } else {
            System.out.println("Lugano already loaded!");
        }
    }
}
