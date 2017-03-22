/**
 * Created by Andrea on 19/03/2017.
 */
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var SERVER_URL = "http://" + window.location.host + "/";

    // On pick interpolations
    var prepareButton = function (mesh, boxMaterial, scene) {

        mesh.actionManager = new BABYLON.ActionManager(scene);

        var boxMaterialFocus = new BABYLON.StandardMaterial("boxMaterailFocus", scene);
        boxMaterialFocus.diffuseTexture = new BABYLON.Texture("/images/build.jpg", scene);
        boxMaterialFocus.specularColor = BABYLON.Color3.Black();
        boxMaterialFocus.emissiveColor = BABYLON.Color3.Green();

        //ON MOUSE ENTER
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
                var meshLocal = ev.meshUnderPointer
                // meshLocal.material.emissiveColor = BABYLON.Color3.Green();
                meshLocal.material = boxMaterialFocus;
                canvas.style.cursor = "move"
            }, false));

        //ON MOUSE EXIT
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
                var meshLocal = ev.meshUnderPointer
                // meshLocal.material.emissiveColor = BABYLON.Color3.Black()
                meshLocal.material = boxMaterial;
                canvas.style.cursor = "default";
            }, false));

        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function (ev) {
                $.ajax({
                           url: SERVER_URL + "building/info/"+mesh.name.substr(mesh.name.indexOf("_") + 1),
                           type: "GET",
                           success: function (data, textStatus, jqXHR) {
                            console.log(data);
                           }
                       });

            }, false));
    };

    var loadCity = function (scene) {
        // var boxMaterial = new BABYLON.StandardMaterial("boxMaterail", scene);
        // boxMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        // boxMaterial.specularColor = BABYLON.Color3.Black();
        // boxMaterial.emissiveColor = BABYLON.Color3.White();

        $.ajax({
                   // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",
                   // // ENTIRE LUGANO url: SERVER_URL +
                   // "/building/max=46.004509,8.948119&min=46.002147,8.951145/", // LAC ZONE
                   url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/",
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {

                       if (data[0]) {
                           var R = 6371;
                           var center_x = R * Math.cos(data[0].centroidLat) * Math.cos(
                                   data[0].centroidLng);
                           var center_y = R * Math.cos(data[0].centroidLat) * Math.sin(
                                   data[0].centroidLng);
                           var center_z = R * Math.sin(data[0].centroidLat);
                       }

                       for (var i = 0; i < data.length; i++) {
                           if (data[i]) {
                               x =
                                   R * Math.cos(data[i].centroidLat) * Math.cos(
                                       data[i].centroidLng);
                               y =
                                   R * Math.cos(data[i].centroidLat) * Math.sin(
                                       data[i].centroidLng);
                               z = R * Math.sin(data[i].centroidLat);

                               console.log(
                                   "putting " + data[i].centroidLat + " " + data[i].centroidLng);

                               var options = {
                                   width: 0.3,
                                   height: 0.3 * (data[i].floors + 1),
                                   depth: 0.3
                               };

                               var box = BABYLON.MeshBuilder.CreateBox("box_" + data[i].id, options,
                                                                       scene);
                               box.position =
                                   new BABYLON.Vector3(x - center_x, y - center_y, z - center_z);

                               var boxMaterial = new BABYLON.StandardMaterial("boxMaterail"
                                                                              + i, scene);
                               boxMaterial.diffuseTexture =
                                   new BABYLON.Texture("/images/build.jpg", scene);
                               boxMaterial.specularColor = BABYLON.Color3.Black();
                               boxMaterial.emissiveColor = BABYLON.Color3.White();

                               prepareButton(box, boxMaterial, scene);

                               box.material = boxMaterial;

                               console.log("Box added" + box);
                           }
                       }
                   }
               });
    };

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(1, 1, 0);

        var camera = new BABYLON.ArcRotateCamera("Camera", -10, 0, 15, BABYLON.Vector3.Zero(), scene);
        // camera.lowerBetaLimit = 0.1;
        // camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        // camera.lowerRadiusLimit = 30;
        // camera.upperRadiusLimit = 150;
        camera.attachControl(canvas, true);

        // var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
        // var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        // groundMaterial.specularColor = BABYLON.Color3.Blue();
        // ground.material = groundMaterial;

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = .5;

        loadCity(scene);

        return scene;
    };

    $.when(createScene()).then(function (data) {
        var scene = data;
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            scene.render();
        });
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

});