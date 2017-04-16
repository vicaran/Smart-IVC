/**
 * Created by Andrea on 08/04/2017.
 */

var loadObjs1 = function () {
    // var staticMaxLat = 46.061271;
    // var maxLat = 46.061271;
    // var maxLng = 8.875321;
    // var minLat = 45.940576;
    // var minLng = 8.996019;

    var staticMaxLat = 46.006998;
    var maxLat = 46.006998;
    var maxLng = 8.942853;
    var minLat = 45.992533;
    var minLng = 8.966763;

    var step = 0.020000;

    while (maxLng < minLng) {
        var intermediateLng = (parseFloat(maxLng) + step).toFixed(6);
        while (maxLat > minLat) {
            var buildings = new Cesium.CustomDataSource();
            var intermediateLat = (parseFloat(maxLat) - step).toFixed(6);
            console.log("DO AJAX");
            $.ajax({
                       url: SERVER_URL + "building/max=" + maxLat + "," + maxLng + "&min=" + intermediateLat + "," + intermediateLng + "/",
                       type: "GET",
                       success: function (data, textStatus, jqXHR) {
                           for (var i = 0; i < data.length; i++) {
                               if (data[i]) {
                                   var list = createList(data[i].ringGlobalCoords);
                                   var height = (data[i].floors + 2) * 3;
                                   if (height > MAX_HEIGHT) {
                                       MAX_HEIGHT = height;
                                   }

                                   var building = new Cesium.Entity({
                                                                        id: 'building_' + data[i].id,
                                                                        name: 'edificio',
                                                                        description: 'edificio desc',
                                                                        polygon: {
                                                                            hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                                                                            height: data[i].altitude,
                                                                            extrudedHeight: (data[i].floors + 2) * 2,
                                                                            material: Cesium.Color.WHITE,
                                                                            outline: false,
                                                                            outlineColor: Cesium.Color.DARKGREY,
                                                                            outlineWidth: 0.1,
                                                                            // shadows: Cesium.ShadowMode.ENABLED,
                                                                            closeTop: true,
                                                                            closeBottom: false,
                                                                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000.0)
                                                                        },
                                                                        // viewFrom: new Cesium.Cartesian3(0, -750000, 500000)
                                                                    });
                                   viewer.entities.add(building);

                                   // var promise = new Cesium. viewer.entities.add({
                                   //                         id: 'building_' + data[i].id,
                                   //                         name: 'edificio',
                                   //                         description: 'edificio desc',
                                   //                         polygon: {
                                   //                             hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                                   //                             height: data[i].altitude,
                                   //                             extrudedHeight: (data[i].floors + 2) * 2,
                                   //                             material: Cesium.Color.WHITE,
                                   //                             outline: true,
                                   //                             outlineColor: Cesium.Color.DARKGREY,
                                   //                             outlineWidth: 0.5,
                                   //                             // shadows: Cesium.ShadowMode.ENABLED,
                                   //                             closeTop: true,
                                   //                             closeBottom: false,
                                   //                             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000.0)
                                   //                         }
                                   //                     });

                               }
                           }
                       }
                   });
            maxLat = intermediateLat;
        }
        maxLat = staticMaxLat;
        maxLng = intermediateLng;
    }
}