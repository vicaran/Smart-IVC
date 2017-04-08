package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Building;
import com.app.repositories.BuildingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Andrea on 17/03/2017.
 */

@RestController
@RequestMapping("/building")
public class BuildingController {

    private final BuildingRepository buildingRepository;

    @Autowired
    public BuildingController(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET)
    public ResponseEntity handleBuildingById(@PathVariable Long id) {

        Building building = this.buildingRepository.findBuildingById(id).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(building);
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
