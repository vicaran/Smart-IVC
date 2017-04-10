package com.app.API.OpenStreetMap;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.JSONException;
import org.json.simple.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

/**
 * Created by Andrea on 30/03/2017.
 */
public class LocationInfo implements OpenStreetMapAPIServices {

    @Override
    public HashMap<String, String> buildingInfo(Double latitude, Double longitude, Long building_id) {
        HashMap<String, String> result = new HashMap<String, String>();
        HttpResponse<JsonNode> response = null;
        String composedUrl = OpenStreetMapGeocodingUrl + "&lat=" + latitude + "&lon=" + longitude + "&zoom=20&addressdetails=1";
        try {
            response = Unirest.get(composedUrl).asJson();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        if (response != null && response.getStatus() == 200) {
            try {
                createJsonFile(response.getBody(), latitude, longitude, building_id);
//                result = checkExistenceAndPut(response.getBody(), result);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    @Override
    public String[] getFields() {
        return fields;
    }

    @SuppressWarnings("unchecked")
    private void createJsonFile(JsonNode response, Double latitude, Double longitude, Long building_id) throws IOException {

        JSONObject obj = new JSONObject();

        obj.put("Building_ID", building_id);
        obj.put("latitude", latitude);
        obj.put("longitude", longitude);
        obj.put("OSMInfo", response);

        String prepender = ",";

        File jsonFile = new File("src/main/resources/city_data/OSM_DATA9.json");
        if(!jsonFile.exists()){
            prepender = "[";
        }
        FileOutputStream oFile = new FileOutputStream(jsonFile, true);
        oFile.write((prepender + obj.toString()).getBytes());
        oFile.flush();
        oFile.close();
    }

    private HashMap<String, String> checkExistenceAndPut(JsonNode jsonNode, HashMap<String, String> result) {
        org.json.JSONObject fieldValue = jsonNode.getObject().getJSONObject("address");
        for (String field : this.getFields()) {
            try{

            }catch (JSONException e){

            }
            fieldValue.get(field);
            System.out.println(fieldValue.toString());

//            System.out.println(field);
//            System.out.println(xml.getElementById(field));
        }
        return result;
    }
}
