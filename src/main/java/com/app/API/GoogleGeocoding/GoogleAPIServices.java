package com.app.API.GoogleGeocoding;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by Andrea on 16/03/2017.
 */
public interface GoogleAPIServices {

    /**
     * Building info array list.
     *
     * @param latitude  the latitude
     * @param longitude the longitude
     * @return the array list
     * @throws Exception the exception
     */
    ArrayList<String> buildingInfo(Double latitude, Double longitude) throws Exception;

    /**
     * City info hash map.
     *
     * @param cityName the city name
     * @return the hash map
     * @throws Exception the exception
     */
    HashMap<String, String> cityInfo(String cityName) throws Exception;

    /**
     * Elevation info double.
     *
     * @param latitude  the latitude
     * @param longitude the longitude
     * @return the double
     * @throws Exception the exception
     */
    Double elevationInfo(Double latitude, Double longitude) throws Exception;
}