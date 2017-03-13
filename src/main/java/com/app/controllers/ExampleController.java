package com.app.controllers;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

/**
 * Created by Andrea on 27/02/2017.
 */

@RestController
public class ExampleController {

    @RequestMapping("/example")
    public ResponseEntity example() throws Exception {
        GeoApiContext context = new GeoApiContext().setApiKey("AIzaSyCY1ov7-HWE-CahFZyIjaGOQYGYK-T8wls");

        GeocodingResult[] results = GeocodingApi.newRequest(context)
                .latlng(new LatLng(-33.8674869, 151.2069902)).await();
        System.out.println(results[0].toString());

        return new ResponseEntity(results, HttpStatus.OK);
    }
}
