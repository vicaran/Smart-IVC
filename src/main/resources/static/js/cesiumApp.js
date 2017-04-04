/**
 * Created by Andrea on 29/03/2017.
 */
var SERVER_URL = "http://" + window.location.host + "/";
var viewer = new Cesium.Viewer('cesiumContainer', {
    //Use standard Cesium terrain
    terrainProvider: new Cesium.CesiumTerrainProvider({
                                                          url: 'https://assets.agi.com/stk-terrain/world'
                                                      })
});

//Add basic drag and drop functionality
viewer.extend(Cesium.viewerDragDropMixin);
//Show a pop-up alert if we encounter an error when processing a dropped file
viewer.dropError.addEventListener(function(dropHandler, name, error) {
    console.log(error);
    window.alert(error);
});

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
}

$.ajax({
           // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",// ENTIRE LUGANO
           url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/", // AROUND LAKE
           type: "GET",
           success: function (data, textStatus, jqXHR) {
               // console.log(data);
               for (var i = 0; i < data.length; i++) {
                   if (data[i]) {
                       var list = createList(data[i].ringGlobalCoords);
                       if (data[i].id === 17296) {
                           // console.log(list);

                       }
                       viewer.entities.add({
                                               name: 'building_' + data[i].id,
                                               polygon: {
                                                   hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
                                                   extrudedHeight: (data[i].floors + 2) * 2,
                                                   material: Cesium.Color.WHITE.withAlpha(0.5),
                                                   closeTop: true,
                                                   closeBottom: false
                                               }
                                           });

                   }
               }
           }
       });

var orangePolygon = viewer.entities.add({
                                            name: 'Green extruded polygon',
                                            polygon: {
                                                hierarchy: Cesium.Cartesian3.fromDegreesArray([8.940234296, 46.001618057,
                                                                                               8.940222342, 46.001634017,
                                                                                               8.940279381, 46.001654760,
                                                                                               8.940276082, 46.001659167,
                                                                                               8.940307237, 46.001670502,
                                                                                               8.940317349, 46.001657006,
                                                                                               8.940354346, 46.001670459,
                                                                                               8.940404273, 46.001603779,
                                                                                               8.940279080, 46.001558247,
                                                                                               8.940234296, 46.001618057]),
                                                extrudedHeight: 2,
                                                material: Cesium.Color.ORANGE.withAlpha(0.5),
                                                closeTop: true,
                                                closeBottom: false
                                            }
                                        });

var lac = viewer.entities.add({
                                            name: 'lac',
                                            polygon: {
                                                hierarchy: Cesium.Cartesian3.fromDegreesArray([8.948367394,45.999413912,
                                                                                               8.948314616,45.999589197,
                                                                                               8.948352830,45.999595253,
                                                                                               8.948504815,45.999619335,
                                                                                               8.948509730,45.999604244,
                                                                                               8.948571927,45.999612433,
                                                                                               8.948566484,45.999629107,
                                                                                               8.948655100,45.999643142,
                                                                                               8.948665400,45.999601399,
                                                                                               8.948704801,45.999605144,
                                                                                               8.948724917,45.999541173,
                                                                                               8.948869397,45.999562304,
                                                                                               8.948861283,45.999588695,
                                                                                               8.949112317,45.999625403,
                                                                                               8.949073732,45.999747997,
                                                                                               8.949044273,45.999841581,
                                                                                               8.949026590,45.999897744,
                                                                                               8.949060340,45.999902547,
                                                                                               8.949062457,45.999905776,
                                                                                               8.949107869,45.999912518,
                                                                                               8.949108574,45.999910053,
                                                                                               8.949127857,45.999912718,
                                                                                               8.949129740,45.999915824,
                                                                                               8.949172561,45.999922393,
                                                                                               8.949177256,45.999920295,
                                                                                               8.949319974,45.999937384,
                                                                                               8.949308141,45.999516164,
                                                                                               8.948849540,45.999449104,
                                                                                               8.948499618,45.999397931,
                                                                                               8.948415478,45.999385627,
                                                                                               8.948405373,45.999419421,
                                                                                               8.948367394,45.999413912]),
                                                extrudedHeight: 2,
                                                material: Cesium.Color.RED.withAlpha(0.5),
                                                closeTop: true,
                                                closeBottom: false
                                            }
                                        });

viewer.zoomTo(viewer.entities);

