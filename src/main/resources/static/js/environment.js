/**
 * Created by Andrea on 08/04/2017.
 */

var viewer = new Cesium.Viewer('cesiumContainer', {
    //Use standard Cesium terrain
    // terrainProvider : new Cesium.CesiumTerrainProvider({
    //                                                        url : 'https://assets.agi.com/stk-terrain/world'
    //                                                    }),
    baseLayerPicker: false,
    fullscreenButton: true,
    vrButton: true,
    geocoder: false,
    // selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
    imageryProvider: false,
    // imageryProvider: new Cesium.MapboxImageryProvider({
    //                                                         url: 'https://api.mapbox.com/v4/',
    //                                                         mapId: 'mapbox.streets'
    //                                                            }),
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


var myLayerPicker = '<span id="baseLayerPickerContainer" class="cesium-navigationHelpButton-wrapper"></span>';
$(myLayerPicker).insertBefore($(".cesium-navigationHelpButton-wrapper"));

var imageryViewModels = [];
imageryViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'Open\u00adStreet\u00adMap',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
                                                        tooltip : 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
map of the world.\nhttp://www.openstreetmap.org',
                                                        creationFunction : function() {
                                                            return Cesium.createOpenStreetMapImageryProvider({
                                                                                                                 url : 'https://a.tile.openstreetmap.org/'
                                                                                                             });
                                                        }
                                                    }));

imageryViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'Black Marble',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/blackMarble.png'),
                                                        tooltip : 'The lights of cities and villages trace the outlines of civilization \
in this global view of the Earth at night as seen by NASA/NOAA\'s Suomi NPP satellite.',
                                                        creationFunction : function() {
                                                            return Cesium.createTileMapServiceImageryProvider({
                                                                                                                  url : 'https://cesiumjs.org/blackmarble',
                                                                                                                  credit : 'Black Marble imagery courtesy NASA Earth Observatory',
                                                                                                                  flipXY : true
                                                                                                              });
                                                        }
                                                    }));

imageryViewModels.push(new Cesium.ProviderViewModel({
                                                        name : 'Natural Earth\u00a0II',
                                                        iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
                                                        tooltip : 'Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/',
                                                        creationFunction : function() {
                                                            return Cesium.createTileMapServiceImageryProvider({
                                                                                                                  url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                                                                                                              });
                                                        }
                                                    }));


//Finally, create the baseLayerPicker widget using our view models.
var layers = viewer.imageryLayers;
var baseLayerPicker = new Cesium.BaseLayerPicker('baseLayerPickerContainer', {
    globe : viewer.scene.globe,
    imageryProviderViewModels : imageryViewModels
});