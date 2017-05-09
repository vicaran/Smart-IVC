package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Type;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Andrea on 17/03/2017.
 */
@RestController
@RequestMapping("/building")
public class BuildingController {

    private final BuildingRepository buildingRepository;
    private final AddressRepository addressRepository;

    /**
     * Instantiates a new Building controller.
     *
     * @param buildingRepository the building repository
     * @param addressRepository  the address repository
     */
    @Autowired
    public BuildingController(BuildingRepository buildingRepository, AddressRepository addressRepository) {
        this.buildingRepository = buildingRepository;
        this.addressRepository = addressRepository;
    }

    /**
     * Handle building by id response entity.
     *
     * @param id the id
     * @return the response entity
     */
    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleBuildingById(@PathVariable Long id) {

        Building building = this.buildingRepository.findBuildingById(id).orElseThrow(NotFoundException::new);
        List<Address> addresses = building.getAddresses();


        JSONObject buildingNumbers = new JSONObject();
        JSONObject buildingAddresses = new JSONObject();
        JSONObject buildingTypes = new JSONObject();

        if (addresses != null) {

            for (int i = 0; i < addresses.size(); i++) {
                buildingAddresses.append("" + i, addresses.get(i).getAddressName());
                buildingNumbers.append("" + i, addresses.get(i).getHouseNumber());
                StringBuilder typesString = new StringBuilder();

                for (Type type : addresses.get(i).getTypes()) {
                    typesString.append(type.getTypeName()).append(", ");
                }
                if (typesString.length() > 2) {
                    buildingTypes.append("" + i, typesString.substring(0, typesString.length() - 2));
                }
            }
        }

        String result = new JSONObject()
                .put("id", building.getId())
                .put("floors", building.getFloors())
                .put("civicNumbers", buildingNumbers)
                .put("addresses", buildingAddresses)
                .put("types", buildingTypes)
                .put("ringCoords", Base64.encodeBase64String(building.getRingGlobalCoords())).toString();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Handle buildings by coords response entity.
     *
     * @param maxLat the max lat
     * @param maxLng the max lng
     * @param minLat the min lat
     * @param minLng the min lng
     * @return the response entity
     */
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


    /**
     * Handle buildings by coords response entity.
     *
     * @param id the id
     * @return the response entity
     */
    @RequestMapping(value = "/city={id}/", method = RequestMethod.GET)
    public ResponseEntity<?> handleBuildingsByCoords(@PathVariable Long id) {

        List<Building> buildings = this.buildingRepository.findBuildingByOwnCityId(id);

        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }

    /**
     * Handle building by type response entity.
     *
     * @param id the id
     * @return the response entity
     */
    @RequestMapping(value = "/type/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleBuildingByType(@PathVariable Long id) {
        Collection<Address> allTypes = this.addressRepository.findByTypes_Id(id);

        Set<Long> buildingIds = new HashSet<>();
        for (Address address: allTypes) {
            buildingIds.add(address.getBuilding().getId());
        }

        String result = new JSONObject()
                .put("buildingIds",buildingIds).toString();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/floors/{comparisonVal}/{floorsNumber}/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleBuildingByFloors(
            @PathVariable String comparisonVal,
            @PathVariable int floorsNumber) {

        Collection<Building> buildings = null;
        Set<Long> buildingIds = new HashSet<>();
        switch (comparisonVal) {
            case "greater":
                buildings = buildingRepository.findBuildingsByFloorsGreaterThan(floorsNumber);
                break;
            case "equal":
                buildings = buildingRepository.findBuildingsByFloorsEquals(floorsNumber);
                break;
            case "less":
                buildings = buildingRepository.findBuildingsByFloorsLessThan(floorsNumber);
                break;
            default:
                buildings = new ArrayList<>();
        }

        for (Building building : buildings) {
            buildingIds.add(building.getId());
        }
        String result = new JSONObject()
                .put("buildingIds",buildingIds).toString();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

