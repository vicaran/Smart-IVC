package com.app.API.GoogleGeocoding;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by Andrea on 16/03/2017.
 */
public interface GoogleAPIServices {

    ArrayList<String> buildingInfo(Double latitude, Double longitude) throws Exception;

    HashMap<String, String> cityInfo(String cityName) throws Exception;
}