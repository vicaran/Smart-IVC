package com.app.API.SwissTopo;

import com.app.utils.dataStructures.Pair;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.JSONObject;

/**
 * Created by Andrea on 29/03/2017.
 */
public class SwissTopoConverter implements SwissTopoAPIServices {

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
}
