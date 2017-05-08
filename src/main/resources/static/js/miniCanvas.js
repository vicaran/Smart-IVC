/**
 * Created by Andrea on 30/04/2017.
 */
let createMiniCanvas = function (data, babylonEngine) {
    let canvas = undefined;
    let iframe = document.getElementsByClassName('cesium-infoBox-iframe');
    let innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
    canvas = innerDoc.getElementById("renderMiniCanvas");
    babylonEngine = new BABYLON.Engine(canvas, true);

    let createScene = function () {
        let scene = new BABYLON.Scene(babylonEngine);
        scene.clearColor = new BABYLON.Color3(0.128, 0.128, 0.128);

        let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
        camera.setPosition(new BABYLON.Vector3(5, 2, -5));
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 8;

        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(5, 2, -5), scene);
        light.intensity = 0.7;
        let coordinateZero = getFirstCoordinate(createRing(data.ringCoords));
        coordinateZero = latLngToXYZ(coordinateZero.Lat, coordinateZero.Lng);
        let shape = createShape(data.ringCoords, coordinateZero);
        let path = createPath(data.floors);
        let box = BABYLON.Mesh.ExtrudeShape("miniBox_" + data.id, shape, path, 1, 0, 3, scene);

        box.receiveShadows = true;
        return scene;
    };

    let babylonScene = createScene();

    babylonEngine.runRenderLoop(function () {
        if (babylonScene.activeCamera) {
            babylonScene.activeCamera.alpha += .01;
        }
        babylonScene.render();
    });

    return babylonEngine;
};