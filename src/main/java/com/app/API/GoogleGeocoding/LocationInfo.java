package com.app.API.GoogleGeocoding;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.AddressComponent;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.Geometry;
import com.google.maps.model.LatLng;

import com.app.utils.APIKeys;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * The type Location info.
 */
public class LocationInfo implements GoogleAPIServices {

    /**
     * The Context.
     */
    GeoApiContext context;

    /**
     * Instantiates a new Location info.
     */
    public LocationInfo(){
        this.context = new GeoApiContext().setApiKey(APIKeys.GoogleKey);
    }

    public ArrayList<String> buildingInfo(Double lat, Double lng) throws Exception {

        GeocodingResult[] results = GeocodingApi.newRequest(this.context).latlng(new LatLng(lat, lng)).await();
        System.out.println(results[0].toString());
        //TODO
        
        return new ArrayList<>();
    }

    public HashMap<String, String> cityInfo(String cityName) throws Exception {

        GeocodingResult[] results = GeocodingApi.newRequest(this.context).address(cityName).await();

        AddressComponent[] addressComponents = results[0].addressComponents;
        Geometry geometry = results[0].geometry;

        HashMap<String, String> requiredInfo = new HashMap<>();

        for (AddressComponent addressComponent : addressComponents) {
            String componentType = addressComponent.types[0].toString();
            if (componentType.equals("administrative_area_level_1")) {
                requiredInfo.put("area", addressComponent.longName);
            } else if (componentType.equals("country")) {
                requiredInfo.put("country", addressComponent.longName);
            }
        }

        String cityBounds = (geometry.bounds.northeast.lat + " "
                + geometry.bounds.northeast.lng + ","
                + geometry.bounds.southwest.lat + " "
                + geometry.bounds.southwest.lng);
        requiredInfo.put("bounds", cityBounds);

        return requiredInfo;
    }

    public Double elevationInfo(Double latitude, Double longitude){
        return 2.0;
    }
}
