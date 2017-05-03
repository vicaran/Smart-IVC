package com.app.utils;

import com.app.API.SwissTopo.SwissTopoAPIServices;
import com.app.API.SwissTopo.SwissTopoConverter;
import com.app.models.Address;
import com.app.models.Building;
import com.app.utils.dataStructures.Pair;

import java.nio.charset.StandardCharsets;

/**
 * Created by Andrea on 14/04/2017.
 */
public class OnlineConverter {

    private SwissTopoAPIServices swissTopo;

    public OnlineConverter() {
        this.swissTopo = new SwissTopoConverter();
    }


    public Building convertBuildingRingCHtoWGS(Building building, byte[] ring) {
        String globalCoordinates = "";
        String swissCoords = new String(ring, StandardCharsets.UTF_8);
        String[] points = swissCoords.split(",");
        int pointsCounter = 0;

        for (String point : points) {
            pointsCounter++;
            String[] pointNE = point.split(" ");
            Pair<Double, Double> convertedCoords = this.swissTopo.CHtoWGS(Double.parseDouble(pointNE[0]), Double.parseDouble(pointNE[1]));
            globalCoordinates += convertedCoords.getL() + " " + convertedCoords.getR() + ",";
        }
        if (globalCoordinates.length() > 0) {
            globalCoordinates = globalCoordinates.substring(0, globalCoordinates.length() - 1);
        }

        if (pointsCounter == 2) {
            building.setBoundCoords(globalCoordinates.getBytes());
        } else {
            building.setRingGlobalCoords(globalCoordinates.getBytes());
        }

        return building;
    }

    public Building convertBuildingCentroidCHtoWGS(Building building) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(building.getCentroidLat(), building.getCentroidLng());
        building.setCentroidLat(convertedCentroid.getL());
        building.setCentroidLng(convertedCentroid.getR());
        return building;
    }

    public Address convertAddressCoordinatesCHtoWGS(Address address) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(address.getLatitude(), address.getLongitude());
        address.setLatitude(convertedCentroid.getL());
        address.setLongitude(convertedCentroid.getR());
        return address;
    }
}