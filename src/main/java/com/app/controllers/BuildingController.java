package com.app.controllers;

import com.app.repositories.BuildingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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

    @RequestMapping(value = "/max={maxLat},{maxLng}&min={minLat}{minLng}", method = RequestMethod.GET)
    public ResponseEntity handleCity(@PathVariable Double maxLat, Double maxLng, Double minLat, Double minLng) {

        //max=46.004509,8.948119&min=46.002147,8.951145
        return new ResponseEntity(HttpStatus.OK);

    }
}
