/**
 * Created by Andrea on 24/03/2017.
 */
var SERVER_URL = "http://" + window.location.host + "/";


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

var latLngToArr = function (lat, lng) {
    return {
        'x': lat,
        'y': lng,
        'z': 0
    }
};

var getFirstCoordinate = function (ringCoordinate) {
    return {
        'Lat': ringCoordinate[0].split(" ")[0],
        'Lng': ringCoordinate[0].split(" ")[1]
    }
};

var createRing = function (binaryCoordinates) {
    return (atob(binaryCoordinates)).split(",");
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