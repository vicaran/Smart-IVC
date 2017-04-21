package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Address;
import com.app.models.Building;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/**
 * Created by Andrea on 17/03/2017.
 */

@RestController
@RequestMapping("/building")
public class BuildingController {

    private final BuildingRepository buildingRepository;
    private final AddressRepository addressRepository;

    @Autowired
    public BuildingController(BuildingRepository buildingRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.addressRepository = addressRepository;
    }

    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity handleBuildingById(@PathVariable Long id) {

        Building building = this.buildingRepository.findBuildingById(id).orElseThrow(NotFoundException::new);
        List<Address> addresses = this.addressRepository.findAddressByOwnBuilding(building);

        JSONObject buildingNumbers = new JSONObject();
        JSONObject buildingAddresses = new JSONObject();
//        JSONObject buildingTypes = new JSONObject();

        if (addresses != null) {
            for (int i = 0; i < addresses.size(); i++) {
                buildingAddresses.append("" + i, addresses.get(i).getAddressName());
                buildingNumbers.append("" + i, addresses.get(i).getHouseNumber());
//                buildingTypes.append("" + i, addresses.get(i).getTypes());
            }
        }


        String obj = new JSONObject()
                .put("floors", building.getFloors())
                .put("addresses", buildingAddresses)
                .put("civicNumbers", buildingNumbers).toString();
//                .put("types", buildingTypes).toString();
//TODO HANDLE TYPES
        return ResponseEntity.ok(obj);
    }


    @RequestMapping(value = "/max={maxLat},{maxLng}&min={minLat},{minLng}/", method = RequestMethod.GET)
    public ResponseEntity<?> handleBuildingsByCoords(@PathVariable Double maxLat,
                                     @PathVariable Double maxLng,
                                     @PathVariable Double minLat,
                                     @PathVariable Double minLng) {
        long start = System.currentTimeMillis();

        List<Building> buildings = this.buildingRepository.findBuildingsByCentroidLatLessThanAndCentroidLngGreaterThanAndCentroidLatGreaterThanAndCentroidLngLessThan(maxLat, maxLng, minLat, minLng);

        long end = System.currentTimeMillis();
        System.out.println("Time for query is: " + (end-start));
        System.out.println(buildings.size());

        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }
}

