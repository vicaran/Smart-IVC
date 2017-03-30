package com.app.commands;

import com.app.API.OpenStreetMap.LocationInfo;
import com.app.API.OpenStreetMap.OpenStreetMapAPIServices;
import com.app.API.SwissTopo.SwissTopoAPIServices;
import com.app.API.SwissTopo.SwissTopoConverter;
import com.app.models.Building;
import com.app.models.City;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.utils.creators.CityCreator;
import com.app.utils.dataStructures.Pair;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
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

    public ScheduledTasks(BuildingRepository buildingRepository, CityRepository cityRepository) {
        this.buildingRepository = buildingRepository;
        this.cityRepository = cityRepository;
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
//        updateTimer.schedule(myInformationTask, 30000);
        updateTimer.schedule(myLoadLuganoTask, 10000);
    }

    @Scheduled
    public void converterTask() {
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
            if (building.getCentroidLat() >= 90 && building.getCentroidLng() >= 180) {
                centroidUpdated = true;
                building = this.convertCentroidCHtoWGS(building);
            }

            // Save updated values
            if (ringUpdated || centroidUpdated) {
                buildingRepository.save(building);
                System.out.println("Building " + building.getId() + " saved!");
            }

        }
        System.out.println("Ring Coordinates Updated: " + ringUpdated + ".");
        System.out.println("Centroid Coordinates Updated: " + centroidUpdated + ".");
    }

    @Scheduled
    public void informationTask() {
        List<Building> buildings = this.buildingRepository.findAll();
        OpenStreetMapAPIServices services = new LocationInfo();
        for (Building building : buildings) {
            HashMap<String, String> result = services.buildingInfo(building.getCentroidLat(), building.getCentroidLng());

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

    @Scheduled
    public void loadLuganoTask() {
        List<Building> buildings = this.buildingRepository.findAll();
        Optional<City> cityLugano = this.cityRepository.findCityByName("Lugano");
        if ((buildings.size() == 0) && (cityLugano.equals(Optional.empty()))) {
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
            }
            System.out.println("Lugano data loaded!");
        } else {
            System.out.println("Lugano already loaded!");
        }

    }
}
