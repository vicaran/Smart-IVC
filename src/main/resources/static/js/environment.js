/**
 * Created by Andrea on 08/04/2017.
 */

Cesium.BingMapsApi.defaultKey = "AibFjJSh0jKod09GGPlExgM-mBd5DEah5hPAeIVTDHQhEuUHi0PAhYKS3vmFi-i9";
Cesium.MapboxApi.defaultAccessToken = "pk.eyJ1IjoidmljYXJhIiwiYSI6ImNqMmYxbWx0NjA3cHgzNnF5eDB2M2p3ZHoifQ.T97LWm5-1lUxOKfz048CNg";


// Cesium.Camera.DEFAULT_OFFSET = new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-70.0), Cesium.Math.toRadians(-70.0));
// Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(8.893699999999999, 46.1191401, 9.089630099999999, 45.93971);

let viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    timeline: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
    imageryProvider: false,
    creditContainer : "cesium_credits_div",
    terrainShadows: Cesium.ShadowMode.ENABLED,
    projectionPicker: false,

    homeButton: false,
    // navigationHelpButton: false
});

// //Add basic drag and drop functionality
viewer.extend(Cesium.viewerDragDropMixin);
//Show a pop-up alert if we encounter an error when processing a dropped file
viewer.dropError.addEventListener(function (dropHandler, name, error) {
    console.log(error);
    window.alert(error);
});

viewer.infoBox.frame.removeAttribute('sandbox');

viewer.camera.setView({
                          destination : Cesium.Rectangle.fromDegrees(8.941063, 45.993499, 8.977996, 45.980138),
                          orientation: {
                              heading : 0.0,
                              pitch : Cesium.Math.toRadians(-35),
                              roll : viewer.camera.roll
                          }
                      });

//
let scene = viewer.scene;
// scene.debugShowFramesPerSecond = true;
scene.orderIndependentTranslucency = false;
scene.contextOptions = {
    allowTextureFilterAnisotropic: false,
    webgl: {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
    }
};

scene.shadows = false;
scene.fog = new Cesium.Fog({enabled: false});
scene.fxaa = false;
scene.moon = undefined;

let myLayerPicker = '<span id="baseLayerPickerContainer" class="cesium-navigationHelpButton-wrapper"></span>';
$(myLayerPicker).insertBefore($(".cesium-navigationHelpButton-wrapper"));

let imageryViewModels = [];
let terrainViewModels = [];


imageryViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'Bing\u00adMaps\u00a0Aerial',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/bingAerial.png'),
                                                        tooltip : 'Bing Maps aerial Imagery',
                                                        creationFunction : function() {
                                                            return new Cesium.BingMapsImageryProvider({
                                                                                                          url : 'https://dev.virtualearth.net',
                                                                                                          key : 'AibFjJSh0jKod09GGPlExgM-mBd5DEah5hPAeIVTDHQhEuUHi0PAhYKS3vmFi-i9',
                                                                                                          mapStyle : Cesium.BingMapsStyle.AERIAL
                                                                                                      });
                                                        }
                                                    }));

imageryViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'Mapbox\u00adStreet\u00a0Classic',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/mapboxStreets.png'),
                                                        tooltip : 'Mapbox streets basic imagery',
                                                        creationFunction : function() {
                                                            return new Cesium.MapboxImageryProvider({
                                                                                                        url: 'https://api.mapbox.com/v4/',
                                                                                                        mapId: 'mapbox.streets'
                                                                                                    });
                                                        }
                                                    }));






terrainViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'STK\u00a0World\u00a0Terrain\u00a0meshes',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
                                                        tooltip: 'High-resolution, mesh-based terrain for the entire globe. Free for use on the Internet. Closed-network options are available.http://www.agi.com',
                                                        creationFunction : function() {
                                                            return new Cesium.CesiumTerrainProvider({
                                                                                                        url : 'https://assets.agi.com/stk-terrain/world'
                                                                                                    });
                                                        }
                                                    }));
// terrainViewModels.push(new Cesium.ProviderViewModel({
//                                                         name: 'WGS84\u00a0Ellipsoid',
//                                                         iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
//                                                         tooltip: 'WGS84 standard ellipsoid, also known as EPSG:4326',
//                                                         creationFunction: function () {
//                                                             return new Cesium.EllipsoidTerrainProvider();
//                                                         }
//                                                     }));





let layers = viewer.imageryLayers;
let baseLayerPicker = new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
    globe : viewer.scene.globe,
    imageryProviderViewModels : imageryViewModels,
    terrainProviderViewModels: terrainViewModels
});
