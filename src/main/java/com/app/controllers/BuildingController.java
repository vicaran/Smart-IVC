package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Type;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.utils.dataStructures.Pair;

import org.apache.commons.codec.binary.Base64;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static java.lang.Double.valueOf;

/**
 * The type Building controller.
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
                .put("civic Numbers", buildingNumbers)
                .put("street Names", buildingAddresses)
                .put("types", buildingTypes)
                .put("suburb", building.getSuburb().getName())
                .put("Primary Houses", building.getPrimaryHouses() + primaryPercentage)
                .put("Secondary Houses", building.getSecondaryHouses() + secondaryPercentage)
                .put("EGID", building.getEgidUca())
                .put("shape Length", building.getShapeArea())
                .put("shape Area", building.getShapeLength())
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
     * Handle query response entity.
     *
     * @param queryBody the query body
     * @return the response entity
     */
    @RequestMapping(value = "/query/{queryBody}/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleQuery(@PathVariable String queryBody) {
        boolean withProximity = false;
        List buildingIds = new ArrayList<>();

        String[] queryFirstParam = queryBody.split("proximity");
        if (queryFirstParam[0].length() != queryBody.length()) {
            withProximity = true;
        }

        List buildings = buildingRepository.findByFilterText(new HashSet<>(Arrays.asList(queryBody.split("&"))), !withProximity);

        if (withProximity) {
            buildingIds.add(computeProximity(queryFirstParam, buildings));
        } else {
            buildingIds = buildings;
        }

        String result = new JSONObject().put("buildingIds", buildingIds).toString();

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/distanceQuery/{queryBody}/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> distanceQuery(@PathVariable String queryBody) {
        String[] queryParts = queryBody.split("&");
        String[] queryFirstParam = queryParts[0].split("=");
        Pair<Double, Double> buildingPos = getLatLonFromRequestBody(queryFirstParam);

        List result = buildingRepository.findByDistance(buildingPos.getL(), buildingPos.getR(), 1, BuildingRepository.ALL_RESULTS);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private Long computeProximity(String[] queryVal, List<Building> buildings) {
        Pair<Double, Double> buildingPos = getLatLonFromRequestBody(queryVal[1].split("=")[1].split("_"));
        Double lat = buildingPos.getL();
        Double lng = buildingPos.getR();
        System.out.println(lat);
        System.out.println(lng);
        System.out.println();
        Integer R = 6371; // radius of earth in km
        Double closest = Double.POSITIVE_INFINITY;
        Long closestBuildingId = null;

        for (Building building : buildings) {
            Double mlat = building.getCentroidLat();
            Double mlng = building.getCentroidLng();
            Double d = (R * Math.acos(Math.cos(rad(lat)) * Math.cos(rad(mlat)) * Math.cos(rad(mlng) - rad(lng)) + Math.sin(rad(lat)) * Math.sin(rad(mlat))));
            if (d < closest) {
                closest = d;
                closestBuildingId = building.getId();
            }
        }
        return closestBuildingId;
    }

    @NotNull
    @Contract(pure = true)
    private Double rad(Double x) {
        return x * (Math.PI / 180);
    }

    @NotNull
    private Pair<Double, Double> getLatLonFromRequestBody(String[] queryParam) {
        Double latitude = 0.0;
        Double longitude = 0.0;

        System.out.println(queryParam[0]);
        System.out.println(queryParam[1]);

        switch (queryParam[0]) {
            case "buildingId":
                Optional<Building> building = buildingRepository.findBuildingById(Long.valueOf(queryParam[1]));
                if (building.isPresent()) {
                    latitude = building.get().getCentroidLat();
                    longitude = building.get().getCentroidLng();
                }
                break;
            case "latitude":
                latitude = valueOf(queryParam[1]);
                longitude = valueOf(queryParam[3]);
                break;
            default:
                break;
        }
        return new Pair<>(latitude, longitude);
    }


    @RequestMapping(value = "/distanceMap/byTypeId={typeId}/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> distanceMap(@PathVariable String typeId) {
        String queryByType = "type=" + typeId;
        List<Building> buildings = buildingRepository.findBuildingCoordinatesByType(queryByType);

        List result = new ArrayList();
        for (Building building : buildings) {
//           Set last argument as BuildingRepository.ALL_RESULTS in order not to limit the maximum number of result
            result.addAll(buildingRepository.findByDistance(building.getCentroidLat(), building.getCentroidLng(), 1, BuildingRepository.ALL_RESULTS));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

