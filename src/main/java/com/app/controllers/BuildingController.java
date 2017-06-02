package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Type;
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

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

/**
 * Created by Andrea on 17/03/2017.
 */
@RestController
@RequestMapping("/building")
public class BuildingController {

    private final BuildingRepository buildingRepository;

    /**
     * Instantiates a new Building controller.
     *
     * @param buildingRepository the building repository
     */
    @Autowired
    public BuildingController(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
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

        String primaryPercentage;
        String secondaryPercentage;

        if (building.getPrimaryHousesPercentage() == null && building.getSecondaryHousesPercentage() == null) {
            primaryPercentage = secondaryPercentage = "";
        } else {
            primaryPercentage = " (" + building.getPrimaryHousesPercentage() + "%)";
            secondaryPercentage = " (" + building.getSecondaryHousesPercentage() + "%)";
        }

        String result = new JSONObject()
                .put("id", building.getId())
                .put("floors", building.getFloors())
                .put("civicNumbers", buildingNumbers)
                .put("addresses", buildingAddresses)
                .put("types", buildingTypes)
                .put("suburb", building.getSuburb().getName())
                .put("Primary Houses", building.getPrimaryHouses() + primaryPercentage)
                .put("Secondary Houses", building.getSecondaryHouses() + secondaryPercentage)
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

        List<Building> buildings = this.buildingRepository.findBuildingsByCentroidLatLessThanAndCentroidLngGreaterThanAndCentroidLatGreaterThanAndCentroidLngLessThan(maxLat, maxLng, minLat, minLng);

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
     * @param queryBody the query body
     * @return the response entity
     */
    @RequestMapping(value = "/query/{queryBody}/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleQuery(@PathVariable String queryBody) {

        List<Building> buildingIds = buildingRepository.findByFilterText(new HashSet<>(Arrays.asList(queryBody.split("&"))));


        String result = new JSONObject().put("buildingIds", buildingIds).toString();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

