package com.app.API.SwissTopo;

import com.app.utils.dataStructures.Pair;

import org.json.JSONObject;

/**
 * The interface Swiss topo api services.
 */
public interface SwissTopoAPIServices {

    /**
     * The constant SwissTopoCHtoWGSURL.
     */
    String SwissTopoCHtoWGSURL = "http://geodesy.geo.admin.ch/reframe/lv03towgs84?";
    /**
     * The constant SwissTopoEgidToBuildingHead.
     */
    String SwissTopoEgidToBuildingHead = "http://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfs.gebaeude_wohnungs_register&searchText=";
    /**
     * The constant SwissTopoEdigToBuildingTail.
     */
    String SwissTopoEdigToBuildingTail = "&searchField=egid&returnGeometry=false&contains=false";

    /**
     * The constant SwissTopoSuburbfromCoordinateHead.
     */
    String SwissTopoSuburbfromCoordinateHead = "http://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=";
    /**
     * The constant SwissTopoSuburbfromCoordinateTail.
     */
    String SwissTopoSuburbfromCoordinateTail = "&geometryFormat=geojson&geometryType=esriGeometryPoint&imageDisplay=1017,759,96&layers=all:ch.swisstopo-vd.ortschaftenverzeichnis_plz&mapExtent=714056.101749473,94537.91634074351,718596.800863215,97926.69768521766&returnGeometry=true&tolerance=10";

    /**
     * C hto wgs pair.
     *
     * @param easting  the easting
     * @param northing the northing
     * @return the pair
     */
    Pair<Double,Double> CHtoWGS(Double easting, Double northing);

    /**
     * Egid to building address json object.
     *
     * @param egid the egid
     * @return the json object
     */
    JSONObject egidToBuildingAddress(Long egid);

    /**
     * Coordinate to suburb string.
     *
     * @param swissXCoord the swiss x coord
     * @param swissYCoord the swiss y coord
     * @return the string
     */
    String coordinateToSuburb(String swissXCoord, String swissYCoord);
}