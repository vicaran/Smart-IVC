package com.app.utils;

import org.springframework.beans.factory.annotation.Value;

/**
 * Created by Andrea on 15/03/2017.
 */
public class APIKeys {

    @Value("${GoogleMapsKey}")
    public static String GoogleMapsKey;

}