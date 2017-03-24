/**
 * Created by Andrea on 24/03/2017.
 */
/**
 * Created by Andrea on 19/03/2017.
 */
var createMiniCanvas = function (data) {
    var canvas = document.getElementById("renderMiniCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.278, 0.639, 0.854);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
        camera.setPosition(new BABYLON.Vector3(3, 3, -5));
        camera.attachControl(canvas, true);

        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.intensity = 0.6;

        var coordinateZero = getFirstCoordinate(createRing(data.ringCoords));
        coordinateZero = latLngToXYZ(coordinateZero.Lat, coordinateZero.Lng);
        var shape = createShape(data.ringCoords, coordinateZero);
        var path = createPath(data.floors);

        var box = BABYLON.Mesh.ExtrudeShape("miniBox_" + data.id, shape,
                                            path, 1, 0,
                                            3, scene);

        var boxMaterial = new BABYLON.StandardMaterial("miniBoxMaterial", scene);

        boxMaterial.diffuseTexture = new BABYLON.Texture("/images/build.jpg", scene);

        boxMaterial.specularColor = BABYLON.Color3.Black();

        boxMaterial.emissiveColor = BABYLON.Color3.White();
        box.material = boxMaterial;

        return scene;
    };

    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.activeCamera.alpha += .01;
        scene.render();
    });
};