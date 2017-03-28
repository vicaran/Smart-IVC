/**
 * Created by Andrea on 29/03/2017.
 */
var viewer = new Cesium.Viewer('cesiumContainer');

var orangePolygon = viewer.entities.add({
                                            name: 'Orange polygon with per-position heights and outline',
                                            polygon: {
                                                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([8.950662684162136, 46.004349572580935, 1,
                                                                                                      8.95049763021592, 46.0043612086136, 1,
                                                                                                      8.950469222723234, 46.0043638833533, 1,
                                                                                                      8.95050174954989, 46.004436332513265, 1,
                                                                                                      8.950614576391356, 46.004412504097175, 1,
                                                                                                      8.950644503028688, 46.00440551553882, 1,
                                                                                                      8.950679809219741, 46.004395990450476, 1,
                                                                                                      8.950662684162136, 46.004349572580935, 1]),
                                                extrudedHeight: 0,
                                                perPositionHeight: true,
                                                material: Cesium.Color.ORANGE.withAlpha(0.5),
                                                outline: true,
                                                outlineColor: Cesium.Color.BLACK
                                            }
                                        });

viewer.zoomTo(viewer.entities);