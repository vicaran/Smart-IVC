/**
 * Created by Andrea on 08/04/2017.
 */

var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: true,
    vrButton: true,
    // geocoder: false,
    // selectionIndicator: false,
    timeline: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
    imageryProvider: false,
    terrainShadows: Cesium.ShadowMode.DISABLED,
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
scene.contextOptions = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false
};
scene.fog = new Cesium.Fog({enabled: false});
scene.fxaa = false;
scene.moon = undefined;
// scene.skyAtmosphere = undefined;

var myLayerPicker = '<span id="baseLayerPickerContainer" class="cesium-navigationHelpButton-wrapper"></span>';
$(myLayerPicker).insertBefore($(".cesium-navigationHelpButton-wrapper"));

var imageryViewModels = [];
var terrainViewModels = [];

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
terrainViewModels.push(new Cesium.ProviderViewModel({
                                                        name: 'WGS84\u00a0Ellipsoid',
                                                        iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
                                                        tooltip: 'WGS84 standard ellipsoid, also known as EPSG:4326',
                                                        creationFunction: function () {
                                                            return new Cesium.EllipsoidTerrainProvider();
                                                        }
                                                    }));





var layers = viewer.imageryLayers;
var baseLayerPicker = new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
    globe : viewer.scene.globe,
    imageryProviderViewModels : imageryViewModels,
    terrainProviderViewModels: terrainViewModels
});
viewer.resolutionScale = 0.9;


viewer.infoBox.frame.removeAttribute('sandbox');
// var node = document.createElement("DIV");
// node.id = "miniCanvasZone";
// var canvas = document.createElement("CANVAS");
// canvas.id = "renderMiniCanvas";
// node.appendChild(canvas);
// viewer.infoBox.frame.contentDocument.body.prepend(node);