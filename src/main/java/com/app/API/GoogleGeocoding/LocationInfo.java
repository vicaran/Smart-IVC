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

    GeoApiContext context;

    public LocationInfo(){
        this.context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);
    }

    public void buildingInfo(Double lat, Double lng) throws Exception {

        GeocodingResult[] results = GeocodingApi.newRequest(this.context).latlng(new LatLng(lat, lng)).await();
        System.out.println(results[0].toString());
    }

    public void cityInfo(String cityName) throws Exception {

        GeocodingResult[] results = GeocodingApi.newRequest(this.context).address(cityName).await();
        System.out.println(results[0].toString());
    }
}
