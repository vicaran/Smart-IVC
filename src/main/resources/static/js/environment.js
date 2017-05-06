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

// //Add basic drag and drop functionality
viewer.extend(Cesium.viewerDragDropMixin);
//Show a pop-up alert if we encounter an error when processing a dropped file
viewer.dropError.addEventListener(function (dropHandler, name, error) {
    console.log(error);
    window.alert(error);
});

viewer.resolutionScale = 0.8;
viewer.infoBox.frame.removeAttribute('sandbox');

var scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
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

// var node = document.createElement("DIV");
// node.id = "miniCanvasZone";
// var canvas = document.createElement("CANVAS");
// canvas.id = "renderMiniCanvas";
// node.appendChild(canvas);
// viewer.infoBox.frame.contentDocument.body.prepend(node);



//
//
// /* Create a extruded triangle */
// var polygon = new Cesium.PolygonGeometry({
//                                              polygonHierarchy : new Cesium.PolygonHierarchy(
//                                                  Cesium.Cartesian3.fromDegreesArray([
//                                                                                         0,90,
//                                                                                         72,74.2421,
//                                                                                         0,74.2421
//                                                                                     ])
//                                              ),
//                                              extrudedHeight: 10000
//                                          });
// var geometry = Cesium.PolygonGeometry.createGeometry(polygon);
//
// //load a gltf template, the template itselt works
// // var templ = fs.readFileSync('box.gltf');
// // var templobj = JSON.parse(templ);
// var obj = {
//         "accessors": {
//             "accessor_21": {
//                 "bufferView": "bufferView_29",
//                 "byteOffset": 0,
//                 "byteStride": 0,
//                 "componentType": 5123,
//                 "count": 36,
//                 "type": "SCALAR"
//             },
//             "accessor_23": {
//                 "bufferView": "bufferView_30",
//                 "byteOffset": 0,
//                 "byteStride": 12,
//                 "componentType": 5126,
//                 "count": 24,
//                 "max": [
//                     0.5,
//                     0.5,
//                     0.5
//                 ],
//                 "min": [
//                     -0.5,
//                     -0.5,
//                     -0.5
//                 ],
//                 "type": "VEC3"
//             },
//             "accessor_25": {
//                 "bufferView": "bufferView_30",
//                 "byteOffset": 288,
//                 "byteStride": 12,
//                 "componentType": 5126,
//                 "count": 24,
//                 "max": [
//                     1,
//                     1,
//                     1
//                 ],
//                 "min": [
//                     -1,
//                     -1,
//                     -1
//                 ],
//                 "type": "VEC3"
//             }
//         },
//         "animations": {},
//         "asset": {
//             "generator": "collada2gltf@027f74366341d569dea42e9a68b7104cc3892054",
//             "premultipliedAlpha": true,
//             "profile": {
//                 "api": "WebGL",
//                 "version": "1.0.2"
//             },
//             "version": "1.0"
//         },
//         "bufferViews": {
//             "bufferView_29": {
//                 "buffer": "Box",
//                 "byteLength": 72,
//                 "byteOffset": 0,
//                 "target": 34963
//             },
//             "bufferView_30": {
//                 "buffer": "Box",
//                 "byteLength": 576,
//                 "byteOffset": 72,
//                 "target": 34962
//             }
//         },
//         "buffers": {
//             "Box": {
//                 "byteLength": 648,
//                 "type": "arraybuffer",
//                 "uri": "Box.bin"
//             }
//         },
//         "materials": {
//             "Effect-Red": {
//                 "name": "Red",
//                 "technique": "technique0",
//                 "values": {
//                     "diffuse": [
//                         0.8,
//                         0,
//                         0,
//                         1
//                     ],
//                     "shininess": 256,
//                     "specular": [
//                         0.2,
//                         0.2,
//                         0.2,
//                         1
//                     ]
//                 }
//             }
//         },
//         "meshes": {
//             "Geometry-mesh002": {
//                 "name": "Mesh",
//                 "primitives": [
//                     {
//                         "attributes": {
//                             "NORMAL": "accessor_25",
//                             "POSITION": "accessor_23"
//                         },
//                         "indices": "accessor_21",
//                         "material": "Effect-Red",
//                         "mode": 4
//                     }
//                 ]
//             }
//         },
//         "nodes": {
//             "Geometry-mesh002Node": {
//                 "children": [],
//                 "matrix": [
//                     1,
//                     0,
//                     0,
//                     0,
//                     0,
//                     1,
//                     0,
//                     0,
//                     0,
//                     0,
//                     1,
//                     0,
//                     0,
//                     0,
//                     0,
//                     1
//                 ],
//                 "meshes": [
//                     "Geometry-mesh002"
//                 ],
//                 "name": "Mesh"
//             },
//             "node_1": {
//                 "children": [
//                     "Geometry-mesh002Node"
//                 ],
//                 "matrix": [
//                     1,
//                     0,
//                     0,
//                     0,
//                     0,
//                     0,
//                     -1,
//                     0,
//                     0,
//                     1,
//                     0,
//                     0,
//                     0,
//                     0,
//                     0,
//                     1
//                 ],
//                 "name": "Y_UP_Transform"
//             }
//         },
//         "programs": {
//             "program_0": {
//                 "attributes": [
//                     "a_normal",
//                     "a_position"
//                 ],
//                 "fragmentShader": "Box0FS",
//                 "vertexShader": "Box0VS"
//             }
//         },
//         "scene": "defaultScene",
//         "scenes": {
//             "defaultScene": {
//                 "nodes": [
//                     "node_1"
//                 ]
//             }
//         },
//         "shaders": {
//             "Box0FS": {
//                 "type": 35632,
//                 "uri": "Box0FS.glsl"
//             },
//             "Box0VS": {
//                 "type": 35633,
//                 "uri": "Box0VS.glsl"
//             }
//         },
//         "skins": {},
//         "techniques": {
//             "technique0": {
//                 "attributes": {
//                     "a_normal": "normal",
//                     "a_position": "position"
//                 },
//                 "parameters": {
//                     "diffuse": {
//                         "type": 35666
//                     },
//                     "modelViewMatrix": {
//                         "semantic": "MODELVIEW",
//                         "type": 35676
//                     },
//                     "normal": {
//                         "semantic": "NORMAL",
//                         "type": 35665
//                     },
//                     "normalMatrix": {
//                         "semantic": "MODELVIEWINVERSETRANSPOSE",
//                         "type": 35675
//                     },
//                     "position": {
//                         "semantic": "POSITION",
//                         "type": 35665
//                     },
//                     "projectionMatrix": {
//                         "semantic": "PROJECTION",
//                         "type": 35676
//                     },
//                     "shininess": {
//                         "type": 5126
//                     },
//                     "specular": {
//                         "type": 35666
//                     }
//                 },
//                 "program": "program_0",
//                 "states": {
//                     "enable": [
//                         2929,
//                         2884
//                     ]
//                 },
//                 "uniforms": {
//                     "u_diffuse": "diffuse",
//                     "u_modelViewMatrix": "modelViewMatrix",
//                     "u_normalMatrix": "normalMatrix",
//                     "u_projectionMatrix": "projectionMatrix",
//                     "u_shininess": "shininess",
//                     "u_specular": "specular"
//                 }
//             }
//         }
//     };
//
// //write indices accessor and bufferview
// var accessor_21 = obj.accessors.accessor_21;
// accessor_21.count = geometry.indices.length;
// var bufferView_29 = obj.bufferViews.bufferView_29;
// bufferView_29.byteLength = geometry.indices.buffer.byteLength;
// bufferView_29.byteOffset = 0;
// var indexBuffer = geometry.indices.buffer;
// var indexBase64 = indexBuffer.toString('base64');
//
//
// //write position
// var accessor_23 = obj.accessors.accessor_23;
// accessor_23.count = geometry.attributes.position.values.length;
// var positionBuffer = geometry.attributes.position.values.buffer;
// var positionBase64 = positionBuffer.toString('base64');
//
// //write normal
// var accessor_25 = obj.accessors.accessor_25;
// accessor_25.count = geometry.attributes.normal.values.length;
// accessor_25.byteOffset = positionBuffer.length;
// var normalBuffer = geometry.attributes.normal.values.buffer;
// var normalBase64 = normalBuffer.toString('base64');
//
// //write positions and normals bufferView
// var bufferView_30 = obj.bufferViews.bufferView_30;
// bufferView_30.byteOffset = indexBuffer.length;
// bufferView_30.byteLength = positionBuffer.length+normalBuffer.length;
//
// //write Buffer
// var buffer = Buffer.concat([indexBuffer,positionBuffer,normalBuffer]);
// var bufferBase64 = buffer.toString('base64');
// var boxBuffer = obj.buffers.Box;
// boxBuffer.byteLength = buffer.length;
// boxBuffer.uri = "data:application/octet-stream;base64,"+bufferBase64;
//
// //write into a file
// var newgltf = JSON.stringify(obj);
// var RETURNOBJ = newgltf;