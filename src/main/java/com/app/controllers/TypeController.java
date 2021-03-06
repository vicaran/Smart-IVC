package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Type;
import com.app.repositories.TypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * The type Type controller.
 */
@RestController
@RequestMapping("/type")
public class TypeController {

    private final TypeRepository typeRepository;

    /**
     * Instantiates a new Type controller.
     *
     * @param typeRepository the type repository
     */
    @Autowired
    public TypeController(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }


    /**
     * Gets typeb by id.
     *
     * @param id the id
     * @return the typeb by id
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity getTypebById(@PathVariable Long id) {
        Type type = this.typeRepository.findTypeById(id).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(type);
    }

    /**
     * Gets type by name.
     *
     * @param name the name
     * @return the type by name
     */
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ResponseEntity getTypeByName(@PathVariable String name) {

        Type type = this.typeRepository.findTypeByTypeName(name).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(type);
    }

    /**
     * Handle building by id response entity.
     *
     * @return the response entity
     */
    @RequestMapping(value = "/getall", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> handleBuildingById() {
        Collection<Type> allTypes = this.typeRepository.findAllByOrderByTypeName();
        return new ResponseEntity<>(allTypes, HttpStatus.OK);
    }
}


