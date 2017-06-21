package com.app.controllers;

import com.app.exceptions.NotFoundException;
import com.app.models.Suburb;
import com.app.repositories.SuburbRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * The type Suburb controller.
 */
@RestController
@RequestMapping("/suburb")
public class SuburbController {

    private final SuburbRepository suburbRepository;

    /**
     * Instantiates a new Suburb controller.
     *
     * @param suburbRepository the suburb repository
     */
    @Autowired
    public SuburbController(SuburbRepository suburbRepository) {
        this.suburbRepository = suburbRepository;
    }


    /**
     * Gets suburb by id.
     *
     * @param id the id
     * @return the suburb by id
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity getSuburbById(@PathVariable Long id) {
        Suburb suburb = this.suburbRepository.findSuburbById(id).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(suburb);
    }

    /**
     * Gets suburby by name.
     *
     * @param name the name
     * @return the suburby by name
     */
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ResponseEntity getSuburbyByName(@PathVariable String name) {

        Suburb suburb = this.suburbRepository.findSuburbByName(name).orElseThrow(NotFoundException::new);
        return ResponseEntity.ok(suburb);
    }

    /**
     * Gets suburb from city id.
     *
     * @param id the id
     * @return the suburb from city id
     */
    @RequestMapping(value = "/fromCityId={id}", method = RequestMethod.GET)
    public ResponseEntity<?> getSuburbFromCityId(@PathVariable Long id) {
        Collection<Suburb> suburbList = this.suburbRepository.findSuburbsByOwnCity_IdOrderByNameAsc(id).orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(suburbList, HttpStatus.OK);
    }
}
