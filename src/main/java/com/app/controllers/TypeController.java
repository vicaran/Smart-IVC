package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Building;
import com.app.models.Type;
import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.TypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * Created by Andrea on 02/05/2017.
 */

@RestController
@RequestMapping("/type")
public class TypeController {

    private final TypeRepository typeRepository;

    @Autowired
    public TypeController(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }


    @RequestMapping(value = "/getall", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleBuildingById() {
        Collection<Type> allTypes = this.typeRepository.findAll();
        return new ResponseEntity<>(allTypes, HttpStatus.OK);
    }
}


