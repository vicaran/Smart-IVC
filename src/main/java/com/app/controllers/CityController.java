package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.City;
import com.app.repositories.CityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Andrea on 27/02/2017.
 */

@RestController
@RequestMapping("/city")
public class CityController {

    private final CityRepository cityRepository;

    @Autowired
    public CityController(CityRepository userRepository) {
        this.cityRepository = userRepository;
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ResponseEntity handleCity (@PathVariable String name) {

        City city = this.cityRepository.findCityByName(name).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(city);

    }
}
