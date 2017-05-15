/**
 * Created by Andrea on 08/04/2017.
 */
let buildingsArray = [];
let buildingsID = [];
let positions = [];
let buildingsHeight = [];


let loadObjs = function (cityID) {
    showLoadingGif();
    $.ajax({
               url: SERVER_URL + "/building/city=" + cityID + "/",
               type: "GET",
               success: function (data) {
                   for (let i = 0; i < data.length; i++) {
                       generateGeometry(data[i]);
                   }
                   updateGeometryHeights();
               }
           });
};

let generateGeometry = function (data) {
    let list = createList(data.ringGlobalCoords);
    let buildingHeight = data.floors === 0 ? 1 : (data.floors * 3);
    let buildingID = 'building_' + data.id;

    buildingsID.push(buildingID);
    buildingsHeight.push(buildingHeight);
    positions.push(Cesium.Cartographic.fromDegrees(data.centroidLng, data.centroidLat));

    let buildingGeometry = new Cesium.PolygonGeometry({
                                                          polygonHierarchy: new Cesium.PolygonHierarchy(
                                                              Cesium.Cartesian3.fromDegreesArray(list)
                                                          ),
                                                          extrudedHeight: buildingHeight,
                                                          closeBottom: false
                                                      });
    let building = new Cesium.GeometryInstance({
                                                   geometry: buildingGeometry,
                                                   id: 'building_' + data.id,
                                                   attributes : {
                                                       color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                                                   },
                                               });
    buildingsArray.push(building);
};

let updateGeometryHeights = function () {
    let promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions);
    Cesium.when(promise, function (updatedPositions) {
        for (let i = 0; i < updatedPositions.length; i++) {
            let prevHeight = buildingsArray[i].geometry._height;
            buildingsArray[i].geometry._height =
                updatedPositions[i].height + ((buildingsArray[i].geometry._height) / 2) + prevHeight;
            buildingsArray[i].geometry._extrudedHeight = updatedPositions[i].height - prevHeight;

            let buildingHeight = buildingsArray[i].geometry._height
                                 - buildingsArray[i].geometry._extrudedHeight;
            if (buildingHeight > MAX_HEIGHT) {
                MAX_HEIGHT = buildingHeight;
            }
        }
        addGeometriesToPrimitives();
    });
};

let addGeometriesToPrimitives = function () {
    let primitivesArray = scene.primitives.add(new Cesium.Primitive({
                                                  geometryInstances: buildingsArray,
                                                  appearance: new Cesium.PerInstanceColorAppearance({
                                                                                                        translucent: false,
                                                                                                    }),
                                                  vertexCacheOptimize: true,
                                                  compressVertices: false,
                                                  interleave: true,
                                                  releaseGeometryInstances: false,
                                                                        shadows: Cesium.ShadowMode.ENABLED,
                                              }));
    primitivesArray.readyPromise.then(function () {
        hideLoadingGif();
    });
};

let callina = function () {
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                                                                             url: '/tilesets/model.glb'
                                                                         }));
}