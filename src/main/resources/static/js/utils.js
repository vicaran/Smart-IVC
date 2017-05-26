/**
 * Created by Andrea on 08/04/2017.
 */
let SERVER_URL = "http://" + window.location.host + "/";
let MAX_HEIGHT = Number.NEGATIVE_INFINITY;
let SEARCH_HISTORY = {};
let geolocalizationCoords = {
    "latitude": 0.0,
    "longitude": 0.0,
    "accuracy": 0.0
};
let GEOLOCALIZATIONVISIBLE = false;

let createRing = function (binaryCoordinates) {
    return (atob(binaryCoordinates)).split(",");
};

let getFirstCoordinate = function (ringCoordinate) {
    return {
        'Lat': ringCoordinate[0].split(" ")[0],
        'Lng': ringCoordinate[0].split(" ")[1]
    }
};

let createShape = function (binaryCoordinates, coordinateZero) {
    let shape = [];
    let ringCoordinate = createRing(binaryCoordinates);
    // let firstCoords = getFirstCoordinate(ringCoordinate);
    // let adjusts = latLngToXYZ(firstCoords.Lat, firstCoords.Lng);
    // let adjusts = latLngToArr(firstLatCoord, firstLngCoord);

    ringCoordinate.forEach(function (data) {
        data = data.split(" ");
        let coord = latLngToXYZ(data[0], data[1]);
        // let coord = latLngToArr(data[0], data[1]);
        // shape.push(new BABYLON.Vector3((coord.x - adjusts.x), (coord.y - adjusts.y), 0));
        shape.push(
            new BABYLON.Vector3(coord.x - coordinateZero.x, coord.y - coordinateZero.y, 0));
    });
    return shape;
};

let createPath = function (floors) {
    let path = [];
    for (let i = 0; i < (floors + 2); i++) {
        let point = new BABYLON.Vector3(0, i / 4, 0);
        path.push(point);
    }
    return path;
};

let latLngToXYZ = function (lat, lng) {
    let R = 6371;
    let x = R * Math.cos(lat) * Math.cos(lng);
    let y = R * Math.cos(lat) * Math.sin(lng);
    let z = R * Math.sin(lat);

    return {
        'x': x,
        'y': y,
        'z': z
    }
};

let createList = function (binaryCoordinates) {
    let shape = [];
    let ringCoordinate = createRing(binaryCoordinates);
    ringCoordinate.forEach(function (data) {
        data = data.split(" ");
        shape.push(data[1]);
        shape.push(data[0])
    });
    return shape;
};

let RGBToHex = function (r, g, b) {
    if (r <= 1 && g <= 1 && b <= 1) {
        r *= 255;
        g *= 255;
        b *= 255;
    }
    let bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
};

let computeColorComplement = function (first, second, third) {
    let hex;

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
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
};

let padZero = function (str, len) {
    len = len || 2;
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
};

let interpolate = function (value, maximum, start_point, end_point) {
    return start_point + (end_point - start_point) * value / maximum;
};

let interpolateColors = function (value, maximum, startRGB, endRGB) {
    let interpolatedColors = [];
    if (startRGB.length === 3 && endRGB.length === 3) {
        interpolatedColors[0] = interpolate(value, maximum, startRGB[0], endRGB[0]);
        interpolatedColors[1] = interpolate(value, maximum, startRGB[1], endRGB[1]);
        interpolatedColors[2] = interpolate(value, maximum, startRGB[2], endRGB[2]);
    }

    return interpolatedColors;
};

let getCameraCoordinates = function () {
    let posUL = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), Cesium.Ellipsoid.WGS84);
    let posLR = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.width, viewer.canvas.height), Cesium.Ellipsoid.WGS84);
    let posLL = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, viewer.canvas.height), Cesium.Ellipsoid.WGS84);
    let posUR = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.width, 0), Cesium.Ellipsoid.WGS84);

    let cartographic;

    if (posUL !== undefined) {
        cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUL);
        let maxLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    }

    if (posUR !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posUR);
        let minLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    }

    if (posLR !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLR);
        let minLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    }

    if (posLL !== undefined) {
    cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(posLL);
        let maxLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    }

    return {
        'maxLat': maxLat || 0.0,
        'maxLon': maxLon || 0.0,
        'minLat': minLat || 0.0,
        'minLon': minLon || 0.0
    }
};

// USED IN LISTENERS
let generateTable = function (data) {
    let miniCanvas = '<div id="miniCanvasZone" style="text-align: center;"><canvas id="renderMiniCanvas" style="margin: auto;"></canvas></div>';
    let table = '<div class="cesium-infoBox-description"><table class="cesium-infoBox-defaultTable"><tbody>';
    for (let field in data) {
        if (field !== undefined && field !== 'ringCoords' && field !== 'id') {
            let value = createValuesForTable(data, field);
            if (value !== undefined) {
                table += '<tr>'
                         + '<th>' + formatText(field) + '</th>'
                         + '<td>' + formatText(value.toString()) + '</td>'
                         + '</tr>'
            }
        }
    }
    table += '</tbody>' + '</table>' + '</div>';

    return miniCanvas + table;
    // return miniCanvas + table + generateQuerieSelector();
};

let generateQuerieSelector = function () {
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

let createValuesForTable = function (data, field) {
    let value = '';
    switch (typeof data[field]) {
        case 'number':
            value = data[field];
            break;
        case 'string':
            value = data[field];
            break;
        case 'object':
            for (let entry in data[field]) {
                if (data[field][entry][0] !== null) {
                    value += data[field][entry][0];
                }
            }
            break;
        default:
            break;
    }
    if (value === "0" || value.length === 0 || value === "null") {
        return undefined;
    }
    return value;
};

let showLoadingGif = function () {
    $("#loadingSpinnerBackground").show()
};

let hideLoadingGif = function () {
    $("#loadingSpinnerBackground").hide()
};

let formatText = function (txt) {

    let frags = txt.split('_');
    for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }

    frags = frags.join(' ').toString().split(', ');
    for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }

    return frags.join(', ');
};

let showButtonSpinner = function ($this) {
    $this.button('loading');
    setTimeout(function () {
        $this.prepend("<i id='spinner-search' class='fa fa-circle-o-notch fa-spin'>");
    }, 10);
};

let hideButtonSpinner = function ($this) {
    $this.button('reset');
    setTimeout(function () {
        $("#spinner-search").remove();
    }, 10);

};

let sortDataTags = function (array) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};

let addResultToHistory = function (queryVal, data) {
    $("#historyPlaceholder").hide();


    if (SEARCH_HISTORY[queryVal] === undefined) {
        SEARCH_HISTORY[queryVal] = data;
        queryVal = queryVal.split("&");

        let queryParts = "";
        console.log(queryVal);
        for (let idx in queryVal) {
            queryParts += "with " + queryVal[idx].split("=")[0] + " being " + queryVal[idx].split("=")[1] +"<br>";
        }

        console.log(queryParts);

        let historyCard = "<li class='orange history_item' id='"+queryVal+"'><a>Find " + queryParts
                          + " Produced " + data["buildingIds"].length + " results"
                          + "</a></li>";

        $("#history_list").prepend(historyCard);

    }
};

// User geolocalization position
let getGeolocalizationCoordinates = function () {

    function geolocalizationSuccess(pos) {
        let crd = pos.coords;
        geolocalizationCoords.latitude = crd.latitude;
        geolocalizationCoords.longitude = crd.longitude;
        geolocalizationCoords.accuracy = crd.accuracy;
    }

    function geolocalizationError(err) {}

    navigator.geolocation.getCurrentPosition(geolocalizationSuccess, geolocalizationError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 900000
    });

    return geolocalizationCoords;
};

let drawPin = function () {
    viewer.entities.removeById('GeolocalizationPos');

    let promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [Cesium.Cartographic.fromDegrees(geolocalizationCoords.longitude,
                                                                                                            geolocalizationCoords.latitude)]);
    Cesium.when(promise, function (updatedPositions) {

        let headPosition = Cesium.Cartesian3.fromDegrees(geolocalizationCoords.longitude,
                                                         geolocalizationCoords.latitude, MAX_HEIGHT + 5);

        let tailPosition = Cesium.Cartesian3.fromDegrees(geolocalizationCoords.longitude,
                                                         geolocalizationCoords.latitude, updatedPositions[0].height + MAX_HEIGHT + 5);

        let groundPosition = Cesium.Cartesian3.fromDegrees(geolocalizationCoords.longitude, geolocalizationCoords.latitude,
                                                           updatedPositions[0].height);

        viewer.entities.add(new Cesium.Entity({
                                                  id: 'GeolocalizationPos',
                                                  show: GEOLOCALIZATIONVISIBLE,
                                                  position: headPosition,
                                                  point: new Cesium.PointGraphics({
                                                                                      color: Cesium.Color.DEEPSKYBLUE,
                                                                                      pixelSize: 20,
                                                                                      outlineColor: Cesium.Color.DODGERBLUE,
                                                                                      outlineWidth: geolocalizationCoords.accuracy *
                                                                                                    0.2,
                                                                                      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                                                                                  }),
                                                  polyline: {
                                                      positions: [groundPosition, tailPosition],
                                                      width: 5,
                                                      followSurface: false,
                                                      material: Cesium.Color.DIMGREY
                                                  }
                                              }))

    });
};

let geolocalizationCommand = function () {
    getGeolocalizationCoordinates();
    setTimeout(function () {
        drawPin();
    }, 6000)
};

geolocalizationCommand();
setInterval(function () {
    geolocalizationCommand()
}, 10000);

let geolocalizationChangeVisibility = function () {
    GEOLOCALIZATIONVISIBLE = !GEOLOCALIZATIONVISIBLE;
    viewer.entities.getById('GeolocalizationPos').show = GEOLOCALIZATIONVISIBLE;
};