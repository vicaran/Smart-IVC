package com.app.API.OpenStreetMap;

import java.util.HashMap;

/**
 * Created by Andrea on 30/03/2017.
 */
public interface OpenStreetMapAPIServices {

    /**
     * The constant OpenStreetMapUrl.
     */
    String OpenStreetMapUrl = "http://api.openstreetmap.org/";
    /**
     * The constant OpenStreetMapTestingUrl.
     */
    String OpenStreetMapTestingUrl = "http://api06.dev.openstreetmap.org/";
    /**
     * The constant OpenStreetMapGeocodingUrl.
     */
    String OpenStreetMapGeocodingUrl =  "http://nominatim.openstreetmap.org/reverse?format=json&";

    /**
     * The constant fields.
     */
    String[] fields = new String[]{"road", "suburb", "town", "house_number"};

    /**
     * Building info hash map.
     *
     * @param latitude    the latitude
     * @param longitude   the longitude
     * @param building_id the building id
     * @return the hash map
     */
    HashMap<String, String> buildingInfo(Double latitude, Double longitude, Long building_id);

    /**
     * Get fields string [ ].
     *
     * @return the string [ ]
     */
    String[] getFields();
}
