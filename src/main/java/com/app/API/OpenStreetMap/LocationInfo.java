package com.app.API.OpenStreetMap;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.w3c.dom.Document;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
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

        File jsonFile = new File("src/main/resources/city_data/OSM_DATA.json");
        if(!jsonFile.exists()){
            prepender = "[";
        }
//        jsonFile.createNewFile();
        FileOutputStream oFile = new FileOutputStream(jsonFile, true);
        oFile.write((prepender + obj.toString()).getBytes());
        oFile.flush();
        oFile.close();
        System.out.println("Successfully Copied JSON Object to File...");
    }

//    private HashMap<String, String> checkExistenceAndPut(Document xml, HashMap<String, String> result) {
//
//        for (String field : this.getFields()) {
//            System.out.println(field);
//            System.out.println(xml.getElementById(field));
//            if (xml.getElementById(field) != null) {
//                result.put(field + "Name", xml.getElementsByTagName("road").item(0).getFirstChild().getTextContent());
//            }
//        }
//        return result;
//    }
}
