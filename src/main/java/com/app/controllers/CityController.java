package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.City;
import com.app.repositories.CityRepository;
import com.app.utils.dataStructures.Pair;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * The type City controller.
 */
@RestController
@RequestMapping("/city")
public class CityController {

    private final CityRepository cityRepository;

    /**
     * Instantiates a new City controller.
     *
     * @param userRepository the user repository
     */
    @Autowired
    public CityController(CityRepository userRepository) {
        this.cityRepository = userRepository;
    }


    /**
     * Gets city by id.
     *
     * @param id the id
     * @return the city by id
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity getCityById (@PathVariable Long id) {

        City city = this.cityRepository.findCityById(id).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(city);
    }

    /**
     * Gets city by name.
     *
     * @param name the name
     * @return the city by name
     */
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ResponseEntity getCityByName (@PathVariable String name) {

        City city = this.cityRepository.findCityByName(name).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(city);
    }

    /**
     * Gets cities.
     *
     * @return the cities
     */
    @RequestMapping(value = "/allCityNames", method = RequestMethod.GET)
    public ResponseEntity<?> getCities() {
        List<City> cityList = this.cityRepository.findAll();

        return new ResponseEntity<>(cityList, HttpStatus.OK);
    }
}
