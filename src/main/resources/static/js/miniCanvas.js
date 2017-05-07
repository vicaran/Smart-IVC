/**
 * Created by Andrea on 30/04/2017.
 */
var createMiniCanvas = function (data) {
    var iframe = document.getElementsByClassName('cesium-infoBox-iframe');
    var innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
    var canvas = innerDoc.getElementById("renderMiniCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.128, 0.128, 0.128);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
        camera.setPosition(new BABYLON.Vector3(5, 2, -5));
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 8;

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(5, 2, -5), scene);
        light.intensity = 0.7;
        var coordinateZero = getFirstCoordinate(createRing(data.ringCoords));
        coordinateZero = latLngToXYZ(coordinateZero.Lat, coordinateZero.Lng);
        var shape = createShape(data.ringCoords, coordinateZero);
        var path = createPath(data.floors);
        var box = BABYLON.Mesh.ExtrudeShape("miniBox_" + data.id, shape, path, 1, 0, 3, scene);

        box.receiveShadows = true;
        return scene;
    };

    var scene = createScene();
    engine.runRenderLoop(function () {
        if (scene.activeCamera) {
            scene.activeCamera.alpha += .01;
        }
        scene.render();
    });
    return scene;
};