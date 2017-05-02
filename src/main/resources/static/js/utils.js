/**
 * Created by Andrea on 08/04/2017.
 */
var SERVER_URL = "http://" + window.location.host + "/";
var MAX_HEIGHT = -10;


var createRing = function (binaryCoordinates) {
    return (atob(binaryCoordinates)).split(",");
};

var getFirstCoordinate = function (ringCoordinate) {
    return {
        'Lat': ringCoordinate[0].split(" ")[0],
        'Lng': ringCoordinate[0].split(" ")[1]
    }
};

var createShape = function (binaryCoordinates, coordinateZero) {
    var shape = [];
    var ringCoordinate = createRing(binaryCoordinates);
    // var firstCoords = getFirstCoordinate(ringCoordinate);
    // var adjusts = latLngToXYZ(firstCoords.Lat, firstCoords.Lng);
    // var adjusts = latLngToArr(firstLatCoord, firstLngCoord);

    ringCoordinate.forEach(function (data) {
        data = data.split(" ");
        var coord = latLngToXYZ(data[0], data[1]);
        // var coord = latLngToArr(data[0], data[1]);
        // shape.push(new BABYLON.Vector3((coord.x - adjusts.x), (coord.y - adjusts.y), 0));
        shape.push(
            new BABYLON.Vector3(coord.x - coordinateZero.x, coord.y - coordinateZero.y, 0));
    });
    return shape;
};

var createPath = function (floors) {
    var path = [];
    for (var i = 0; i < (floors + 2); i++) {
        var point = new BABYLON.Vector3(0, i / 4, 0);
        path.push(point);
    }
    return path;
};

var latLngToXYZ = function (lat, lng) {
    var R = 6371;
    var x = R * Math.cos(lat) * Math.cos(lng);
    var y = R * Math.cos(lat) * Math.sin(lng);
    var z = R * Math.sin(lat);

    return {
        'x': x,
        'y': y,
        'z': z
    }
};

var createList = function (binaryCoordinates) {
    var shape = [];
    var ringCoordinate = createRing(binaryCoordinates);
    ringCoordinate.forEach(function (data) {
        data = data.split(" ");
        shape.push(data[1]);
        shape.push(data[0])
    });
    return shape;
};

var RGBToHex = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
};

var computeColorComplement = function (first, second, third) {
    var hex;

    if (first !== undefined && second !== undefined && third !== undefined) {
        hex = RGBToHex(first * 255, second * 255, third * 255);
    } else if (first !== undefined && second === undefined && third === undefined) {
        hex = first;
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex === "FFFFFF" || hex === "ffffff") {
        return "#ff0000";
    }

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
};

var padZero = function (str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
};

var interpolate = function (value, maximum, start_point, end_point) {
    return start_point + (end_point - start_point) * value / maximum;
};

var interpolateColors = function (value, maximum, startRGB, endRGB) {
    var interpolatedColors = [];
    if (startRGB.length === 3 && endRGB.length === 3) {
        interpolatedColors[0] = interpolate(value, maximum, startRGB[0], endRGB[0]);
        interpolatedColors[1] = interpolate(value, maximum, startRGB[1], endRGB[1]);
        interpolatedColors[2] = interpolate(value, maximum, startRGB[2], endRGB[2]);
    }

    return interpolatedColors;
};

var getCameraCoordinates = function () {
    var posUL = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), Cesium.Ellipsoid.WGS84);
    var posLR = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.width, viewer.canvas.height), Cesium.Ellipsoid.WGS84);
    var posLL = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, viewer.canvas.height), Cesium.Ellipsoid.WGS84);
    var posUR = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.width, 0), Cesium.Ellipsoid.WGS84);

    var cartographic;

    if (posUL !== undefined) {
        cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUL);
        var maxLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    }

    if (posUR !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUR);
    var minLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    }

    if (posLR !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLR);
    var minLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    }

    if (posLL !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLL);
    var maxLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    }

    return {
        'maxLat': maxLat || 0.0,
        'maxLon': maxLon || 0.0,
        'minLat': minLat || 0.0,
        'minLon': minLon || 0.0
    }
};

// USED IN LISTENERS

var generateTable = function (data) {
    var miniCanvas = '<div id="miniCanvasZone" style="text-align: center;"><canvas id="renderMiniCanvas" style="margin: auto;"></canvas></div>';
    var table = '<div class="cesium-infoBox-description"><table class="cesium-infoBox-defaultTable"><tbody>';
    for (var field in data) {
        if (field !== undefined && field !== 'ringCoords' && field !== 'id') {
            var value = createValuesForTable(data, field);
            table += '<tr>'
                     + '<th>' + formatText(field) + '</th>'
                     + '<td>' + formatText(value) + '</td>'
                     + '</tr>'
        }
    }
    table += '</tbody>' + '</table>' + '</div>';

    return miniCanvas + table + generateQuerieSelector();
};

var generateQuerieSelector = function () {
    return '<div class="nowrap sectionContent"><span>Select</span>'
           + '<select id="buildingSelector">'
           + '<option selected="" disabled="" hidden="" value="">Choose...</option>'
           + '<option value="Nearest">Nearest</option>'
           + '</select>'
           + '<select id="buildingType">'
           + '<option selected="" disabled="" hidden="" value="">Choose...</option>'
           + '</select>'
           + '<button type="button" id="queryFromBuilding">Search</button>'
           + '</div>';
};

var createValuesForTable = function (data, field) {
    var value = '';
    switch (typeof data[field]) {
        case 'number':
            value = data[field];
            break;
        case 'object':
            for (var entry in data[field]) {
                if (data[field][entry][0] !== null) {
                    value += data[field][entry][0];
                }
            }
            break;
        default:
            break;
    }
    if (value.length === 0) {
        value = "Not Given"
    }
    return value.toString();
};

var formatText = function (txt) {

    var frags = txt.split('_');
    for (var i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }

    frags = frags.join(' ').toString().split(', ');
    for (var i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }

    return frags.join(', ');

};