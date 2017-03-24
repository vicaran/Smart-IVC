/**
 * Created by Andrea on 24/03/2017.
 */
var createCanvas = function () {
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

        var boxMaterialClicked = new BABYLON.StandardMaterial("boxMaterailFocus", scene);
        boxMaterialClicked.diffuseTexture = new BABYLON.Texture("/images/build.jpg", scene);
        boxMaterialClicked.specularColor = BABYLON.Color3.Black();
        boxMaterialClicked.emissiveColor = BABYLON.Color3.Red();

        //ON MOUSE ENTER
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
                                          function (ev) {
                                              var meshLocal = ev.meshUnderPointer
                                              // meshLocal.material.emissiveColor = BABYLON.Color3.Green();
                                              meshLocal.material = boxMaterialFocus;
                                              canvas.style.cursor = "move"
                                          }, false));

        //ON MOUSE EXIT
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
                                          function (ev) {
                                              var meshLocal = ev.meshUnderPointer
                                              // meshLocal.material.emissiveColor = BABYLON.Color3.Black()
                                              meshLocal.material = boxMaterial;
                                              canvas.style.cursor = "default";
                                          }, false));

        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (ev) {
                var meshLocal = ev.meshUnderPointer
                meshLocal.material = boxMaterialClicked;
                canvas.style.cursor = "default";
            }, false));

        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger,
                                          function (ev) {
                                              $.ajax({
                                                         url: SERVER_URL + "building/info/"
                                                              + mesh.name.substr(
                                                              mesh.name.indexOf("_") + 1),
                                                         type: "GET",
                                                         success: function (data, textStatus,
                                                                            jqXHR) {
                                                             $("#buildingName")
                                                                 .html(data.description);
                                                             $("#buildingAddress").html(
                                                                 "Via xxx, "
                                                                 + data.civicNumber);
                                                             $("#buildingCity").html(
                                                                 data.city.name + " "
                                                                 + data.city.country);
                                                             $("#buildingFloors")
                                                                 .html(data.floors + " floors");
                                                             $("#buildingCoordinates")
                                                                 .html(data.centroidLat + " "
                                                                       + data.centroidLng);
                                                             createMiniCanvas(data);
                                                         }
                                                     });

                                          }, false));
    };

    var loadCity = function (scene) {
        $.ajax({
                   // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",
                   // // ENTIRE LUGANO url: SERVER_URL +
                   // "/building/max=46.004509,8.948119&min=46.002147,8.951145/", // LAC ZONE
                   url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/",
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       if (data[0]) {
                           // var centroidZero = latLngToXYZ(data[0].centroidLat,
                           // data[0].centroidLng); var centroidZero =
                           // latLngToArr(data[0].centroidLat, data[0].centroidLng);

                           var coordinateZero = getFirstCoordinate(
                               createRing(data[0].ringCoords));
                           coordinateZero = latLngToXYZ(coordinateZero.Lat, coordinateZero.Lng);

                           for (var i = 0; i < data.length; i++) {
                               if (data[i]) {

                                   // var centroid = latLngToXYZ(data[i].centroidLat,
                                   // data[i].centroidLng); var centroid =
                                   // latLngToArr(data[i].centroidLat, var firstCoordinate =
                                   // getFirstCoordinate(createRing(data[i].ringCoords));
                                   // firstCoordinate = latLngToXYZ(firstCoordinate.Lat,
                                   // firstCoordinate.Lng);

                                   var shape = createShape(data[i].ringCoords, coordinateZero);
                                   var path = createPath(data[i].floors);

                                   var box = BABYLON.Mesh.ExtrudeShape("box_" + data[i].id, shape, path, 1, 0, 3, scene);
                                   // box.position = new BABYLON.Vector3(centroid.x -
                                   // centroidZero.x, 0, centroid.y - centroidZero.y);

                                   var boxMaterial = new BABYLON.StandardMaterial(
                                       "boxMaterial" + i,
                                       scene);

                                   boxMaterial.diffuseTexture = new BABYLON.Texture("/images/build.jpg", scene);
                                   boxMaterial.diffuseColor = new BABYLON.Color3.Black();

                                   boxMaterial.ambientColor = new BABYLON.Color3(1, 0, 0);
                                   boxMaterial.specularColor = new BABYLON.Color3(1, 0, 0);

                                   boxMaterial.emissiveColor = BABYLON.Color3.White();

                                   prepareButton(box, boxMaterial, scene);
                                   box.checkCollisions = true;
                                   box.material = boxMaterial;
                                   // console.log("Box added" + box);
                               }
                           }
                       }
                   }
               });
    };

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.415, 0.839, 0.909);

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-80, 100, -80),
                                            scene);
        camera.rotation = new BABYLON.Vector3(0.85, 0.90, 0);
        camera.attachControl(canvas, true);

        var ground = BABYLON.Mesh.CreateGround("ground", 150, 150, 0, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        // groundMaterial.clearColor(0.549, 0.4, 0.309);
        groundMaterial.specularColor = new BABYLON.Color3(0.549, 0.4, 0.309);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.549, 0.4, 0.309);
        ground.material = groundMaterial;

        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.intensity = 0.6;

        loadCity(scene);
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        ground.checkCollisions = true;

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
};