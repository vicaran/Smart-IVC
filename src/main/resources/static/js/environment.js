/**
 * Created by Andrea on 08/04/2017.
 */
var viewer = new Cesium.Viewer('cesiumContainer', {
    //Use standard Cesium terrain
    // terrainProvider : new Cesium.CesiumTerrainProvider({
    //                                                        url : 'https://assets.agi.com/stk-terrain/world'
    //                                                    }),
    // baseLayerPicker: false,
    fullscreenButton: true,
    vrButton: true,
    // geocoder: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                                                                   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                                                               }),
    projectionPicker: false
});

//Add basic drag and drop functionality
viewer.extend(Cesium.viewerDragDropMixin);
//Show a pop-up alert if we encounter an error when processing a dropped file
viewer.dropError.addEventListener(function (dropHandler, name, error) {
    console.log(error);
    window.alert(error);
});
var scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
