package com.app.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created by Andrea on 15/03/2017.
 */
@Component
public class APIKeys {

    public static String GoogleKey;

    @Value("${GoogleMapsKey}")
    public void APIKeys(String GoogleMapsKey) {
        GoogleKey = GoogleMapsKey;
    }
}