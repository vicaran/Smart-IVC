/**
 * Created by Andrea on 08/04/2017.
 */
var INCREMENTER = 0.0000000;
var step = 0.01000;

var loadObjs = function (sectionExtremes) {
    var urlVal;
    if (sectionExtremes !== undefined) {
        urlVal =
            "building/max=" + sectionExtremes.maxLat + "," + sectionExtremes.maxLng + "&min=" + sectionExtremes.minLat + "," + sectionExtremes.minLng
            + "/";
    } else {
        // urlVal = "building/max=46.006998,8.942853&min=45.992533,8.966763/"; // AROUND LAKE
        urlVal = "building/max=46.016348,8.942548&min=45.995867, 8.971934/"; // LARGER LAKE
        // urlVal = "/building/max=46.061271,8.875321&min=45.940576,8.996019/";// ENTIRE LUGANO
    }
    console.log(urlVal);
    $.ajax({
               url: SERVER_URL + urlVal,
               type: "GET",
               success: function (data, textStatus, jqXHR) {
                   var buildingsID = [];
                   var positions = [];
                   var buildingsHeight = [];
                   var primitivesArray = [];
                   var counter = 0;
                   for (var i = 0; i < data.length; i++) {
                       if (data[i] && !(sessionStorage.getItem("buildingIDs").includes('building_' + data[i].id))) {
                           counter++;
                           var list = createList(data[i].ringGlobalCoords);
                           var buildingHeight = (data[i].floors + 2) * 2;
                           var buildingID = 'building_' + data[i].id;

                           buildingsID.push(buildingID);
                           buildingsHeight.push(buildingHeight);
                           positions.push(Cesium.Cartographic.fromDegrees(data[i].centroidLng, data[i].centroidLat));

                           var buildingGeometry = new Cesium.PolygonGeometry({
                                                                                 polygonHierarchy : new Cesium.PolygonHierarchy(
                                                                                     Cesium.Cartesian3.fromDegreesArray(list)
                                                                                 ),
                                                                                    granularity: 0.1,
                                                                                    extrudedHeight: buildingHeight,
                                                                                    closeBottom: false
                                                                                       });

                           var building = new Cesium.GeometryInstance({
                                                                          geometry: buildingGeometry,
                                                                          id: 'building_' + data[i].id,
                                                                          attributes: ({
                                                                              distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(
                                                                                  0, 8000),
                                                                              // scaleByDistance: new Cesium.NearFarScalar(0,10, 5000, 1),
                                                                              // translucenceByDistance: new Cesium.NearFarScalar(0, 1,// 5000, 0) })
                                                                          })
                                                                      });
                           var primitive = new Cesium.Primitive({
                                                                    geometryInstances: building,
                                                                    appearance: new Cesium.MaterialAppearance({
                                                                                                                  translucent: false,
                                                                                                                  flat: false,
                                                                                                                  material: new Cesium.Material(
                                                                                                                      {
                                                                                                                          fabric: {
                                                                                                                              type: 'Color',
                                                                                                                              uniforms: {
                                                                                                                                  color: new
                                                                                                                                  Cesium.Color(
                                                                                                                                      1.0,
                                                                                                                                      1.0,
                                                                                                                                      1.0, 1.0)
                                                                                                                              }
                                                                                                                          }
                                                                                                                      })
                                                                                                              }),
                                                                    releaseGeometryInstances: false,
                                                                    interleave: true,
                                                                    cull: false,
                                                                    asynchronous: true,
                                                                });
                           primitivesArray.push(primitive);

                       }
                   }
                   console.log(counter);
                   var promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions);
                   Cesium.when(promise, function (updatedPositions) {
                       for (var i = 0; updatedPositions.length; i++) {

                           var prevHeight = primitivesArray[i].geometryInstances.geometry._height;
                           primitivesArray[i].geometryInstances.geometry._height =
                               updatedPositions[i].height + ((primitivesArray[i].geometryInstances.geometry._height) / 2) + prevHeight;
                           primitivesArray[i].geometryInstances.geometry._extrudedHeight = updatedPositions[i].height - prevHeight;

                           var buildingHeight = primitivesArray[i].geometryInstances.geometry._height
                                                - primitivesArray[i].geometryInstances.geometry._extrudedHeight;
                           if (buildingHeight > MAX_HEIGHT) {
                               MAX_HEIGHT = buildingHeight;
                           }
                           scene.primitives.add(primitivesArray[i]);
                       }
                   });
                   sessionStorage.setItem("buildingIDs", sessionStorage.getItem("buildingIDs").concat(JSON.stringify(buildingsID)));
                   sessionStorage.setItem("buildingElevations", sessionStorage.getItem("buildingElevations").concat(JSON.stringify(positions)));
                   sessionStorage.setItem("buildingHeights", sessionStorage.getItem("buildingHeights").concat(JSON.stringify(buildingsHeight)));
               }
           });
};

var loadHere = function () {
    var pos = getCameraCoordinates();
    setInterval(function () {
        console.log("Calling ajax: " + INCREMENTER);
        var sectionExtremes = {
            maxLat: (parseFloat(pos.maxLat) + parseFloat(INCREMENTER)).toFixed(6),
            maxLng: (parseFloat(pos.maxLon) - parseFloat(INCREMENTER)).toFixed(6),
            minLat: (parseFloat(pos.minLat) + parseFloat(INCREMENTER)).toFixed(6),
            minLng: (parseFloat(pos.minLon) - parseFloat(INCREMENTER)).toFixed(6)
        };
        loadObjs(sectionExtremes);
        INCREMENTER = (parseFloat(INCREMENTER) + step).toFixed(6);
    }, 500)
    ;
};

var cityLoader = function (maxLat, maxLng, minLat, minLng, centroidLat, centroidLng) {

    var sectionExtremes = {
        maxLat: maxLat.toFixed(6),
        maxLng: maxLng.toFixed(6),
        minLat: (maxLat - parseFloat(step)).toFixed(6),
        minLng: minLng.toFixed(6)
    };

    var tid = setInterval(function () {
        loadObjs(sectionExtremes);
        sectionExtremes.maxLat = sectionExtremes.minLat;
        sectionExtremes.minLat = (parseFloat(sectionExtremes.minLat) - parseFloat(step)).toFixed(6);
        if (sectionExtremes.minLat < minLat) {
            console.log("OVERSIZEEEE");
            clearInterval(tid);
        }

    }, 1500)

};