package com.app.API.OpenStreetMap;

import java.util.HashMap;

/**
 * Created by Andrea on 30/03/2017.
 */
public interface OpenStreetMapAPIServices {

    String OpenStreetMapUrl = "http://api.openstreetmap.org/";
    String OpenStreetMapTestingUrl = "http://api06.dev.openstreetmap.org/";
    String OpenStreetMapGeocodingUrl =  "http://nominatim.openstreetmap.org/reverse?format=xml&";

    String[] fields = new String[]{"road", "suburb", "town", "house_number"};

    HashMap<String, String> buildingInfo(Double latitude, Double longitude);

    String[] getFields();
}
