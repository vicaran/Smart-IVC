package com.app.API.GoogleGeocoding;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

import com.app.utils.APIKeys;

/**
 * Created by Andrea on 15/03/2017.
 */
public class LocationInfo {

    public void buildingInfo(Double lat, Double lng) throws Exception {
        GeoApiContext context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);

        GeocodingResult[] results = GeocodingApi.newRequest(context).latlng(new LatLng(lat, lng)).await();
        System.out.println(results[0].toString());
    }

    public void cityInfo(Double lat, Double lng) throws Exception {
        GeoApiContext context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);

        GeocodingResult[] results = GeocodingApi.newRequest(context).latlng(new LatLng(lat, lng)).await();
        System.out.println(results[0].toString());
    }
}
