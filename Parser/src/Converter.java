/**
 * Created by Andrea on 08/03/2017.
 * Modified from: https://github.com/ValentinMinder/Swisstopo-WGS84-LV03
 */


public class Converter {
    //The MIT License (MIT)
    //
    //        Copyright (c) 2014 Federal Office of Topography swisstopo, Wabern, CH
    //
    //        Permission is hereby granted, free of charge, to any person obtaining a copy
    //        of this software and associated documentation files (the "Software"), to deal
    //        in the Software without restriction, including without limitation the rights
    //        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    //        copies of the Software, and to permit persons to whom the Software is
    //        furnished to do so, subject to the following conditions:
    //
    //        The above copyright notice and this permission notice shall be included in all
    //        copies or substantial portions of the Software.
    //
    //        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    //        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    //        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    //        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    //        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    //        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    //        SOFTWARE.
    //
    //        Source: http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/projections.html (see PDFs under "Documentation")
    //        Updated 9 dec 2014
    //        Please validate your results with NAVREF on-line service: http://www.swisstopo.admin.ch/internet/swisstopo/en/home/apps/calc/navref.html (difference ~ 1-2m)

    public Converter() {
        // Only static
    }

    // Convert CH y/x to WGS lat
    public static double CHtoWGSlat(double y, double x) {
        // Converts military to civil and to unit = 1000km
        // Auxiliary values (% Bern)
        double y_aux = (y - 600000) / 1000000;
        double x_aux = (x - 200000) / 1000000;

        // Process lat
        double lat = (16.9023892 + (3.238272 * x_aux))
                - (0.270978 * Math.pow(y_aux, 2))
                - (0.002528 * Math.pow(x_aux, 2))
                - (0.0447 * Math.pow(y_aux, 2) * x_aux)
                - (0.0140 * Math.pow(x_aux, 3));

        // Unit 10000" to 1 " and converts seconds to degrees (dec)
        lat = (lat * 100) / 36;

        return lat;
    }

    // Convert CH y/x to WGS long
    public static double CHtoWGSlng(double y, double x) {
        // Converts military to civil and to unit = 1000km
        // Auxiliary values (% Bern)
        double y_aux = (y - 600000) / 1000000;
        double x_aux = (x - 200000) / 1000000;

        // Process long
        double lng = (2.6779094 + (4.728982 * y_aux)
                + (0.791484 * y_aux * x_aux) + (0.1306 * y_aux * Math.pow(
                x_aux, 2))) - (0.0436 * Math.pow(y_aux, 3));

        // Unit 10000" to 1 " and converts seconds to degrees (dec)
        lng = (lng * 100) / 36;

        return lng;
    }
}

