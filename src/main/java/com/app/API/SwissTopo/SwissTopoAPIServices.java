package com.app.API.SwissTopo;

import com.app.utils.dataStructures.Pair;

/**
 * Created by Andrea on 16/03/2017.
 */
public interface SwissTopoAPIServices {

    String SwissTopoCHtoWGSURL = "http://geodesy.geo.admin.ch/reframe/lv03towgs84?";

    Pair<Double,Double> CHtoWGS(Double easting, Double northing);
}