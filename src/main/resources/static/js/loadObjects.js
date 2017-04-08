/**
 * Created by Andrea on 08/04/2017.
 */

var loadObjs = function () {
    $.ajax({
               // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",// ENTIRE LUGANO
               // url: SERVER_URL + "building/max=46.016348,8.942548&min=45.995867, 8.971934/", // LARGER LAKE
               url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/", // AROUND LAKE
               type: "GET",
               success: function (data, textStatus, jqXHR) {
                   for (var i = 0; i < data.length; i++) {
                       if (data[i]) {
                           var list = createList(data[i].ringGlobalCoords)

                           //TODO: OPTIMIZE THIS PART (FROM ENTITIES TO PRIMITIVES)
                           // var building = new Cesium.GeometryInstance({
                           //                                                            geometry: Cesium.PolygonGeometry.fromPositions({
                           //                                                                                                               positions: Cesium.Cartesian3.fromDegreesArray(list),
                           //                                                                                                               extrudedHeight: (data[i].floors + 2) * 2,
                           //                                                                                                               vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                           //                                                                                                           }),
                           //                                                            attributes: {
                           //                                                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                           //                                                                    Cesium.Color.GREEN)
                           //                                                            }
                           //                                                        });
                           // scene.primitives.add(new Cesium.Primitive({
                           //                                               geometryInstances: building,
                           //                                               appearance: new Cesium.PerInstanceColorAppearance({
                           //                                                                                                     closed: true,
                           //                                                                                                     translucent: false
                           //                                                                                                 })
                           //                                           }));


                           viewer.entities.add({
                                                   id: 'building_' + data[i].id,
                                                   name: 'edificio',
                                                   description: 'edificio desc',
                                                   polygon: {
                                                       hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                                                       height: data[i].altitude,
                                                       extrudedHeight: (data[i].floors + 2) * 2,
                                                       material: Cesium.Color.WHITE,
                                                       outline: true,
                                                       outlineColor: Cesium.Color.DARKGREY,
                                                       outlineWidth: 0.5,
                                                       // shadows: Cesium.ShadowMode.ENABLED,
                                                       closeTop: true,
                                                       closeBottom: false,
                                                       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000.0)
                                                   }
                                               });

                       }
                   }
               }
           });

    viewer.zoomTo(viewer.entities);
}
