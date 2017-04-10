/**
 * Created by Andrea on 08/04/2017.
 */

var loadObjs = function () {
        // var staticMaxLat = 46.006998;
        // var maxLat = 46.006998;
        // var maxLng = 8.942853;
        // var minLat = 45.992533;
        // var minLng = 8.966763;
        //
        // var step = 0.012000;
        //
        // while (maxLng < minLng) {
        //     var intermediateLng = (parseFloat(maxLng) + step).toFixed(6);
        //     while (maxLat > minLat) {
        //         var intermediateLat = (parseFloat(maxLat) - step).toFixed(6);
        //         console.log("DO AJAX");
        //         $.ajax({
        //                    url: SERVER_URL + "building/max=" + maxLat + "," + maxLng + "&min=" + intermediateLat + "," + intermediateLng + "/",
        //                    type: "GET",
        //                    success: function (data, textStatus, jqXHR) {
        //                        for (var i = 0; i < data.length; i++) {
        //                            if (data[i]) {
        //                                var list = createList(data[i].ringGlobalCoords);
        //                                var height = (data[i].floors + 2) * 3;
        //                                if (height > MAX_HEIGHT) {
        //                                    MAX_HEIGHT = height;
        //                                }
        //                                var promise = new Cesium. viewer.entities.add({
        //                                                        id: 'building_' + data[i].id,
        //                                                        name: 'edificio',
        //                                                        description: 'edificio desc',
        //                                                        polygon: {
        //                                                            hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
        //                                                            height: data[i].altitude,
        //                                                            extrudedHeight: (data[i].floors + 2) * 2,
        //                                                            material: Cesium.Color.WHITE,
        //                                                            outline: true,
        //                                                            outlineColor: Cesium.Color.DARKGREY,
        //                                                            outlineWidth: 0.5,
        //                                                            // shadows: Cesium.ShadowMode.ENABLED,
        //                                                            closeTop: true,
        //                                                            closeBottom: false,
        //                                                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000.0)
        //                                                        }
        //                                                    });
        //
        //                            }
        //                        }
        //                    }
        //                });
        //         maxLat = intermediateLat;
        //     }
        //     maxLat = staticMaxLat
        //     maxLng = intermediateLng;
        // }

    $.ajax({
               // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",// ENTIRE LUGANO
               url: SERVER_URL + "building/max=46.016348,8.942548&min=45.995867, 8.971934/", // LARGER LAKE
               // url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/", // AROUND LAKE
               type: "GET",
               success: function (data, textStatus, jqXHR) {
                   for (var i = 0; i < data.length; i++) {
                       if (data[i]) {
                           var list = createList(data[i].ringGlobalCoords);
                           var height = (data[i].floors + 2) * 3;
                           if (height > MAX_HEIGHT) {
                               MAX_HEIGHT = height;
                           }

                           var buildingGeometry = Cesium.PolygonGeometry.fromPositions({
                                                                                           positions: Cesium.Cartesian3.fromDegreesArray(list),
                                                                                           extrudedHeight: height
                                                                                       });

                           var building = new Cesium.GeometryInstance({
                                                                          geometry: buildingGeometry,
                                                                          id: 'building_' + data[i].id,
                                                                          attributes: ({
                                                                              distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(
                                                                                  0, 5000),
                                                                              // scaleByDistance: new Cesium.NearFarScalar(0, 10, 5000, 1),
                                                                              // translucenceByDistance: new Cesium.NearFarScalar(0, 1, 5000, 0)
                                                                          })
                                                                      });

                           scene.primitives.add(new Cesium.Primitive({
                                                                         geometryInstances: building,
                                                                         appearance: new Cesium.MaterialAppearance({
                                                                                                                       closed: true,
                                                                                                                       translucent: false,
                                                                                                                       flat: false,
                                                                                                                       material: new Cesium.Material({
                                                                                                                                                         fabric: {
                                                                                                                                                             type: 'Color',
                                                                                                                                                             uniforms: {
                                                                                                                                                                 color: new Cesium.Color(
                                                                                                                                                                     1.0,
                                                                                                                                                                     1.0,
                                                                                                                                                                     1.0,
                                                                                                                                                                     1.0)
                                                                                                                                                             }
                                                                                                                                                         }
                                                                                                                                                     })
                                                                                                                   }), releaseGeometryInstances: false
                                                                     }));

                           //                 viewer.entities.add({
                           //                                         id: 'building_' + data[i].id,
                           //                                         name: 'edificio',
                           //                                         description: 'edificio desc',
                           //                                         polygon: {
                           //                                             hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                           //                                             height: data[i].altitude,
                           //                                             extrudedHeight: (data[i].floors + 2) * 2,
                           //                                             material: Cesium.Color.WHITE,
                           //                                             outline: true,
                           //                                             outlineColor: Cesium.Color.DARKGREY,
                           //                                             outlineWidth: 0.5,
                           //                                             // shadows: Cesium.ShadowMode.ENABLED,
                           //                                             closeTop: true,
                           //                                             closeBottom: false,
                           //                                             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000.0)
                           //                                         }
                           //                                     });
                           //
                       }
                   }
               }
           });

    // viewer.zoomTo(viewer.entities);
    }
;
