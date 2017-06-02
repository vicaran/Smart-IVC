package com.app.commands;

import com.app.creators.CityCreator;
import com.app.models.Building;
import com.app.models.City;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * The type City loader command.
 */
@Service
public class CityLoaderCommand {

    private final BuildingRepository buildingRepository;
    private final CityRepository cityRepository;
    private final AddressRepository addressRepository;

    /**
     * The Egid idx.
     */
    static final int EGID_IDX = 0;
    private static final int EDID_IDX = 1;
    /**
     * The Road idx.
     */
    static final int ROAD_IDX = 2;
    /**
     * The Civic idx.
     */
    static final int CIVIC_IDX = 3;
    /**
     * The X idx.
     */
    static final int X_IDX = 4;
    /**
     * The Y idx.
     */
    static final int Y_IDX = 5;
    private static final int FLOORS_IDX = 6;
    private static final int PRIMARY_HOUSES_IDX = 7;
    private static final int SECONDARY_HOUSES_IDX = 8;


    /**
     * Instantiates a new City loader command.
     *
     * @param buildingRepository the building repository
     * @param cityRepository     the city repository
     * @param addressRepository  the address repository
     */
    public CityLoaderCommand(BuildingRepository buildingRepository, CityRepository cityRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
    }

    /**
     * Load lugano task.
     */
    @Scheduled
    public void loadLuganoTask() {
        Optional<City> cityLugano = this.cityRepository.findCityByName("Lugano");
        if (!cityLugano.isPresent()) {
            System.out.println("\tLoading Lugano data...");
            CityCreator lugano = new CityCreator();
            try {
                lugano = new CityCreator("src/main/resources/city_data/lugano.xml", "Lugano", "6900");
//                lugano = new CityCreator("src/main/resources/city_data/luganoNew.xml", "Lugano", "6900");

            } catch (Exception e) {
                e.printStackTrace();
            }
            if (lugano.getCityModel() != null) {
                this.saveModels(lugano);
            }
        }
    }

    private void saveModels(CityCreator city) {
        this.cityRepository.save(city.getCityModel());
        this.buildingRepository.save(city.getBuildingList());
        this.addressRepository.save(city.getAddressList());
    }

    /**
     * Additional lugano information task.
     */
    @Scheduled
    public void additionalLuganoInformationTask() {
        BufferedReader br;
        Collection<Building> buildingsToStore = new ArrayList<>();
        try {
            Optional<Building> firstBuilding = buildingRepository.findBuildingById((long) 1);
            if (firstBuilding.isPresent() && firstBuilding.get().getPrimaryHouses() == null) {

                String sCurrentLine;
                br = new BufferedReader(new FileReader("src/main/resources/city_data/lugano_primary_secondary.txt"));


                while ((sCurrentLine = br.readLine()) != null) {
                    if (sCurrentLine.equals("EOF")) {
                        break;
                    }

                    String[] lineValues = sCurrentLine.split(";");
                    if (lineValues[EGID_IDX].equals("\"EGID\"")) {
                        continue;
                    }

                    Optional<List<Building>> buildings = buildingRepository.findBuildingsByEgidUca(Long.parseLong(lineValues[EGID_IDX]));
                    if (buildings.isPresent()) {
                        for (Building building : buildings.get()) {
                            building.setEdidUca((!lineValues[EGID_IDX].equals("")) ? Long.valueOf(formatLineValue(lineValues, EDID_IDX)) : building.getEdidUca());
                            building.setFloors((!lineValues[FLOORS_IDX].equals("")) ? Integer.parseInt((formatLineValue(lineValues, FLOORS_IDX))) : building.getFloors());
                            building.setPrimaryHouses((!lineValues[PRIMARY_HOUSES_IDX].equals("")) ? (formatLineValue(lineValues, PRIMARY_HOUSES_IDX)) : building.getPrimaryHouses());
                            building.setSecondaryHouses((!lineValues[SECONDARY_HOUSES_IDX].equals("")) ? (formatLineValue(lineValues, SECONDARY_HOUSES_IDX)) : building.getSecondaryHouses());

                            buildingsToStore.add(building);
                        }
                    }
                }
                this.buildingRepository.save(buildingsToStore);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String formatLineValue(String[] line, int idx) {
        return line[idx].replaceAll(";", "");
    }

}
