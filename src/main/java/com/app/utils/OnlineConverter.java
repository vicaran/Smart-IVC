package com.app.utils;

import com.app.API.SwissTopo.SwissTopoAPI;
import com.app.API.SwissTopo.SwissTopoAPIServices;
import com.app.models.Address;
import com.app.models.Building;
import com.app.utils.dataStructures.Pair;

import java.nio.charset.StandardCharsets;

/**
 * The type Online converter.
 */
public class OnlineConverter {

    private SwissTopoAPIServices swissTopo;

    /**
     * Instantiates a new Online converter.
     */
    public OnlineConverter() {
        this.swissTopo = new SwissTopoAPI();
    }


    /**
     * Convert building ring c hto wgs building.
     *
     * @param building the building
     * @param ring     the ring
     * @return the building
     */
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

    /**
     * Convert building centroid c hto wgs building.
     *
     * @param building the building
     * @return the building
     */
    public Building convertBuildingCentroidCHtoWGS(Building building) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(building.getCentroidLat(), building.getCentroidLng());
        building.setCentroidLat(convertedCentroid.getL());
        building.setCentroidLng(convertedCentroid.getR());
        return building;
    }

    /**
     * Convert address coordinates c hto wgs address.
     *
     * @param address the address
     * @return the address
     */
    public Address convertAddressCoordinatesCHtoWGS(Address address) {
        Pair<Double, Double> convertedCentroid = this.swissTopo.CHtoWGS(address.getLatitude(), address.getLongitude());
        address.setLatitude(convertedCentroid.getL());
        address.setLongitude(convertedCentroid.getR());
        return address;
    }
}