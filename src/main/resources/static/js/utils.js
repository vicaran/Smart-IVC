/**
 * Created by Andrea on 08/04/2017.
 */
var SERVER_URL = "http://" + window.location.host + "/";
var MAX_HEIGHT = -10;


var createRing = function (binaryCoordinates) {
    return (atob(binaryCoordinates)).split(",");
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

    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUL);
    var maxLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);

    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUR);
    var minLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);

    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLR);
    var minLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);

    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLL);
    var maxLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);

    return {
        'maxLat': maxLat,
        'maxLon': maxLon,
        'minLat': minLat,
        'minLon': minLon
    }
};

