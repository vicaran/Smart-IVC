package com.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Andrea on 27/02/2017.
 */

@RestController
public class ExampleController {

    @RequestMapping("/")
    public ResponseEntity example(){
        return new ResponseEntity(HttpStatus.OK);
    }
}
