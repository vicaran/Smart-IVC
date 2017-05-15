package com.app.API.SwissTopo;

import com.app.utils.dataStructures.Pair;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by Andrea on 29/03/2017.
 */
public class SwissTopoAPI implements SwissTopoAPIServices {

    @Override
    public Pair<Double, Double> CHtoWGS(Double easting, Double northing) {
        HttpResponse<JsonNode> response = null;
        Pair<Double, Double> convertedPair = new Pair<>(0.0, 0.0);
        try {
            response = Unirest.get(SwissTopoCHtoWGSURL + "easting=" + easting + "&northing=" + northing + "&format=json").asJson();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        if (response != null && response.getStatus() == 200) {
            JSONObject convertedCoords = response.getBody().getObject();
            convertedPair.setL(convertedCoords.getDouble("northing"));
            convertedPair.setR(convertedCoords.getDouble("easting"));
        }
        return convertedPair;
    }

    @Override
    public JSONObject egidToBuildingAddress(Long egid) {
        HttpResponse<JsonNode> response = null;
        JSONObject attributes = null;
        try {
            response = Unirest.get(buildEgidRequestUrl(egid)).asJson();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        if (response != null && response.getStatus() == 200) {
            JSONObject buildingInfoResponse = response.getBody().getObject();
            JSONArray results = buildingInfoResponse.getJSONArray("results");
            if (results.length() > 0) {
                attributes = (org.json.JSONObject) results.getJSONObject(0).get("attributes");
            }
        }
        return attributes;
    }

    @Override
    public String coordinateToSuburb(String swissXCoord, String swissYCoord) {
        HttpResponse<JsonNode> response = null;
        String suburb = null;
        try {
            response = Unirest.get(buildSuburbRequestUrl(swissXCoord, swissYCoord)).asJson();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        if (response != null && response.getStatus() == 200) {
            JSONObject suburbResponse = response.getBody().getObject();
            JSONArray results = suburbResponse.getJSONArray("results");
            if (results.length() > 0) {
                JSONObject properties = (org.json.JSONObject) results.getJSONObject(0).get("properties");
                suburb = properties.get("langtext").toString();
            }
        }
        return suburb;
    }


    @NotNull
    private String buildEgidRequestUrl(Long egid) {
        return SwissTopoEgidToBuildingHead + egid.toString() + SwissTopoEdigToBuildingTail;
    }

    private String buildSuburbRequestUrl(String swissXCoord, String swissYCoord) {
        return SwissTopoSuburbfromCoordinateHead + swissXCoord.toString() + "," + swissYCoord.toString() + SwissTopoSuburbfromCoordinateTail;

    }
}
