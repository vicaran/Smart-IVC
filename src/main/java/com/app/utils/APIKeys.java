package com.app.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The type Api keys.
 */
@Component
public class APIKeys {

    /**
     * The constant GoogleKey.
     */
    public static String GoogleKey;

    /**
     * Api keys.
     *
     * @param GoogleMapsKey the google maps key
     */
    @Value("${GoogleMapsKey}")
    public void APIKeys(String GoogleMapsKey) {
        GoogleKey = GoogleMapsKey;
    }
}