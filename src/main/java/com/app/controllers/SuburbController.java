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
 * Created by Andrea on 28/04/2017.
 */
@RestController
@RequestMapping("/suburb")
public class SuburbController {

    private final SuburbRepository suburbRepository;

    @Autowired
    public SuburbController(SuburbRepository suburbRepository) {
        this.suburbRepository = suburbRepository;
    }

    @RequestMapping(value = "/fromCityId={id}", method = RequestMethod.GET)
    public ResponseEntity<?> getSuburbFromCityId(@PathVariable Long id) {
        Collection<Suburb> suburbList = this.suburbRepository.findSuburbsByOwnCity_IdOrderByNameAsc(id).orElseThrow(NotFoundException::new);
        return new ResponseEntity<>(suburbList, HttpStatus.OK);
    }
}
