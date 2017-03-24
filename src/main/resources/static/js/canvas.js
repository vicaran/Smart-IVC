/**
 * Created by Andrea on 24/03/2017.
 */
var createCanvas = function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var miniCanvasScene = undefined;


    var prepareButton = function (mesh, boxMaterial, scene, texture) {
        mesh.actionManager = new BABYLON.ActionManager(scene);
        var boxMaterialFocus = new BABYLON.StandardMaterial("boxMaterailFocus", scene);
        boxMaterialFocus.diffuseTexture = new BABYLON.Texture(texture, scene);
        boxMaterialFocus.specularColor = BABYLON.Color3.Black();
        boxMaterialFocus.emissiveColor = BABYLON.Color3.Green();

        var boxMaterialClicked = new BABYLON.StandardMaterial("boxMaterailFocus", scene);
        boxMaterialClicked.diffuseTexture = new BABYLON.Texture(texture, scene);
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
                                                         url: SERVER_URL + "building/info/" + mesh.name.substr(mesh.name.indexOf("_") + 1),
                                                         type: "GET",
                                                         success: function (data, textStatus, jqXHR) {
                                                             $("#buildingName").html(data.description);
                                                             $("#buildingAddress").html("Via unknown, " + data.civicNumber);
                                                             $("#buildingCity").html(data.city.name + " " + data.city.country);
                                                             $("#buildingFloors").html(data.floors + " floors");
                                                             $("#buildingCoordinates").html(data.centroidLat + " " + data.centroidLng);
                                                             if(miniCanvasScene != undefined){
                                                                 miniCanvasScene.dispose();
                                                                 miniCanvasScene = null;
                                                             }
                                                             miniCanvasScene = createMiniCanvas(data, texture);

                                                         }
                                                     });

                                          }, false));
    };

    var prepareBuildings = function (data, scene) {
        if (data[0]) {
            var coordinateZero = getFirstCoordinate(createRing(data[0].ringCoords));
            coordinateZero = latLngToXYZ(coordinateZero.Lat, coordinateZero.Lng);

            for (var i = 0; i < data.length; i++) {
                if (data[i]) {
                    var shape = createShape(data[i].ringCoords, coordinateZero);
                    var path = createPath(data[i].floors);

                    var box = BABYLON.Mesh.ExtrudeShape("box_" + data[i].id, shape, path, 1, 0, 3, scene);

                    var boxMaterial = new BABYLON.StandardMaterial(
                        "boxMaterial" + i,
                        scene);

                    var texture = "/images/build" + Math.floor((Math.random() * 5) + 1) + ".jpg";

                    boxMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
                    boxMaterial.diffuseColor = new BABYLON.Color3.Black();

                    boxMaterial.ambientColor = new BABYLON.Color3(1, 0, 0);
                    boxMaterial.specularColor = new BABYLON.Color3(1, 0, 0);

                    boxMaterial.emissiveColor = BABYLON.Color3.White();

                    prepareButton(box, boxMaterial, scene, texture);
                    box.checkCollisions = true;
                    box.material = boxMaterial;
                    // console.log("Box added" + box);
                }
            }
        }
    };

    var loadCity = function (scene) {
        $.ajax({
                   // url: SERVER_URL + "/building/max=46.061271,8.875321&min=45.940576,8.996019/",// ENTIRE LUGANO
                   url: SERVER_URL + "building/max=46.006998,8.942853&min=45.992533,8.966763/", // AROUND LAKE
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       prepareBuildings(data, scene);
                   }
               });
    };

    var createScene = function () {
        // SET SCENE
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.415, 0.839, 0.909);

        // SET CAMERA
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-80, 100, -80), scene);
        camera.rotation = new BABYLON.Vector3(0.85, 0.90, 0);
        camera.attachControl(canvas, true);

        // SET GROUND
        var ground = BABYLON.Mesh.CreateGround("ground", 150, 150, 0, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.specularColor = new BABYLON.Color3(0.549, 0.4, 0.309);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.549, 0.4, 0.309);
        ground.material = groundMaterial;

        // SET LIGHT
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.intensity = 0.6;

        loadCity(scene);

        //ENABLE COLLISIONS
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        ground.checkCollisions = true;

        return scene;
    };

    $.when(createScene()).then(function (data) {
        var scene = data;
        engine.runRenderLoop(function () {
            scene.render();
        });
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
};