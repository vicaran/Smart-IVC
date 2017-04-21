/**
 * Created by Andrea on 08/04/2017.
 */
var INCREMENTER = 0.0000000;
var step = 0.001000;
var bufferedData = [];
var maxSize = 910;

var loadObjsEntities = function (maxLat, maxLng, minLat, minLng) {
        // var buildings = viewer.entities.add(new Cesium.EntityCollection());
        var buildings = new Cesium.CustomDataSource();
        var urlVal;
        if (maxLat !== undefined && maxLng !== undefined && minLat !== undefined && minLng !== undefined) {
            urlVal = "building/max=" + maxLat + "," + maxLng + "&min=" + minLat + "," + minLng + "/";
        } else {
            urlVal = "building/max=46.006998,8.942853&min=45.992533,8.966763/"; // AROUND LAKE
            // urlVal= "building/max=46.016348,8.942548&min=45.995867, 8.971934/"; // LARGER LAKE
            // urlVal = "/building/max=46.061271,8.875321&min=45.940576,8.996019/";// ENTIRE LUGANO
        }
        $.ajax({
                   url: SERVER_URL + urlVal,
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       viewer.entities.suspendEvents();
                       var buildingsID = [];
                       var positions = [];
                       var buildingsHeight = [];
                       console.log(data.length);
                       // if(data.length < maxSize) {
                       //     var remainingSize = bufferedData.length - maxSize;
                       //     for(var j = 0; j < remainingSize; j++){
                       //         bufferedData.append(data[j]);
                       //     }
                       // }
                       for (var i = 0; i < data.length; i++) {
                           if (data[i] && !(sessionStorage.getItem("buildingIDs").includes('building_' + data[i].id))) {
                               var list = createList(data[i].ringGlobalCoords);
                               var buildingHeight = (data[i].floors + 2) * 2;
                               var buildingID = 'building_' + data[i].id;
                               if (buildingHeight > MAX_HEIGHT) {
                                   MAX_HEIGHT = buildingHeight;
                               }
                               buildingsID.push(buildingID);
                               buildingsHeight.push(buildingHeight);
                               positions.push(Cesium.Cartographic.fromDegrees(data[i].centroidLng, data[i].centroidLat));

                               viewer.entities.add({
                                                       id: buildingID,
                                                       name: 'edificio',
                                                       description: 'edificio desc',
                                                       polygon: {
                                                           hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                                                           extrudedHeight: buildingHeight,
                                                           material: Cesium.Color.WHITE,
                                                           outline: false,
                                                           outlineColor: Cesium.Color.DARKGREY,
                                                           outlineWidth: 0.5,
                                                           closeTop: true,
                                                           closeBottom: false,
                                                           distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000.0)
                                                       }
                                                   });

                           }
                       }
                       var promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions);
                       Cesium.when(promise, function (updatedPositions) {
                           for (var i = 0; updatedPositions.length; i++) {
                               viewer.entities.getById(buildingsID[i]).polygon.height = updatedPositions[i].height +
                                                                                        ((viewer.entities.getById(
                                                                                            buildingsID[i]).polygon.extrudedHeight._value) / 2);
                               viewer.entities.getById(buildingsID[i]).polygon.extrudedHeight = updatedPositions[i].height -
                                                                                                viewer.entities.getById(
                                                                                                    buildingsID[i]).polygon.extrudedHeight._value;
                           }
                       });
                       ;
                       sessionStorage.setItem("buildingIDs",
                                              sessionStorage.getItem("buildingIDs").concat(JSON.stringify(buildingsID)));
                       sessionStorage.setItem("buildingElevations",
                                              sessionStorage.getItem("buildingElevations").concat(JSON.stringify(positions)));
                       sessionStorage.setItem("buildingHeights",
                                              sessionStorage.getItem("buildingHeights").concat(JSON.stringify(buildingsHeight)));
                       viewer.entities.resumeEvents();
                   }
               });
        // viewer.zoomTo(viewer.entities);
        INCREMENTER = (parseFloat(INCREMENTER) + step).toFixed(6);
    }
;

var loadAfterEntities = function () {
    loadObjs(46.014606, 8.953889, 46.009087, 8.963175);
}

var loadHereEntities = function () {
    var pos = getCameraCoordinates();
    setInterval(function () {
        console.log("Calling ajax: " + INCREMENTER);
        loadObjs((parseFloat(pos.maxLat) + parseFloat(INCREMENTER)).toFixed(6),
                 (parseFloat(pos.maxLon) - parseFloat(INCREMENTER)).toFixed(6),
                 (parseFloat(pos.minLat) + parseFloat(INCREMENTER)).toFixed(6),
                 (parseFloat(pos.minLon) - parseFloat(INCREMENTER)).toFixed(6));
    }, 500)
    ;
}

// "46.013468"
// maxLon
//     :
//     "8.954092"
// minLat
//     :
//     "46.009447"
// minLon
//     :
//     "8.960488"