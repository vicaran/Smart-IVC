/**
 * Created by Andrea on 08/04/2017.
 */


var loadObjs = function () {
    // var buildings = viewer.entities.add(new Cesium.EntityCollection());
    var buildings = new Cesium.CustomDataSource();
    $.ajax({
               // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",// ENTIRE LUGANO
               // url: SERVER_URL + "building/max=46.016348,8.942548&min=45.995867, 8.971934/", // LARGER LAKE
               url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/", // AROUND LAKE
               type: "GET",
               success: function (data, textStatus, jqXHR) {
                   viewer.entities.suspendEvents();
                   var buildingsID = [];
                   var positions = [];
                   var buildingsHeight = [];
                   for (var i = 0; i < data.length; i++) {
                       if (data[i]) {
                           var list = createList(data[i].ringGlobalCoords);
                           var buildingHeight = (data[i].floors + 2) * 2;
                           var buildingID = 'building_' + data[i].id;
                           if (buildingHeight > MAX_HEIGHT) {
                               MAX_HEIGHT = buildingHeight;
                           }
                           buildingsID.push(buildingID);
                           buildingsHeight.push(buildingHeight);
                           positions.push(Cesium.Cartographic.fromDegrees(data[i].centroidLng, data[i].centroidLat));

                           // var buildingGeometry = Cesium.PolygonGeometry.fromPositions({
                           //                                                                 positions:
                           // Cesium.Cartesian3.fromDegreesArray(list),
                           //                                                                 extrudedHeight: height
                           //                                                             });
                           //
                           // var building = new Cesium.GeometryInstance({
                           //                                                geometry: buildingGeometry,
                           //                                                id: 'building_' + data[i].id,
                           //                                                attributes: ({
                           //                                                    distanceDisplayCondition: new
                           // Cesium.DistanceDisplayConditionGeometryInstanceAttribute( 0, 5000), // scaleByDistance: new Cesium.NearFarScalar(0,
                           // 10, 5000, 1), // translucenceByDistance: new Cesium.NearFarScalar(0, 1, 5000, 0) }) }); scene.primitives.add(new
                           // Cesium.Primitive({ geometryInstances: building, appearance: new Cesium.MaterialAppearance({ closed: true,
                           // translucent: false, flat: false, material: new Cesium.Material({ fabric: { type: 'Color', uniforms: { color: new
                           // Cesium.Color( 1.0, 1.0, 1.0, 1.0) } } }) }), releaseGeometryInstances: false }));

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
                           viewer.entities.getById(buildingsID[i]).polygon.height = updatedPositions[i].height + ((viewer.entities.getById(buildingsID[i]).polygon.extrudedHeight._value)/2);
                           viewer.entities.getById(buildingsID[i]).polygon.extrudedHeight = updatedPositions[i].height - viewer.entities.getById(buildingsID[i]).polygon.extrudedHeight._value ;
                       }
                   });
                   localStorage.setItem("buildingIDs", JSON.stringify(buildingsID));
                   localStorage.setItem("buildingElevations", JSON.stringify(positions));
                   localStorage.setItem("buildingHeights", JSON.stringify(buildingsHeight));
                   viewer.entities.resumeEvents();
               }
           });
    // viewer.zoomTo(viewer.entities);
    }
;