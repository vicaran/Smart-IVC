/**
 * Created by Andrea on 08/04/2017.
 */

let selectedEntity = undefined;
let hoverEntity = undefined;
let miniCanvasScene = undefined;
let hoverPrevColor = undefined;
let selectPrevColor = undefined;
let translucenceStatus = 1;

let GLOBALSELECTION;

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (click) {
    let pickedObject = viewer.scene.pick(click.position);
    if (pickedObject !== undefined) {
        if (selectedEntity !== undefined) {
            selectedEntity.color = selectPrevColor;
        }
        selectedEntity = getPrimitiveFromPrimitiveId(pickedObject.id);
        selectPrevColor = hoverPrevColor;
        selectedEntity.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
        loadInfoBox(pickedObject.id.split("_")[1]);
    } else {
        if (selectedEntity !== undefined) {
            selectedEntity.color = selectPrevColor;
            selectedEntity = undefined;
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function (movement) {
    let hoverObject = viewer.scene.pick(movement.endPosition);

    if (hoverObject !== undefined && getPrimitiveFromPrimitiveId(hoverObject.id) !== selectedEntity) {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.color = hoverPrevColor;
        }
        hoverEntity = getPrimitiveFromPrimitiveId(hoverObject.id);
        hoverPrevColor = hoverEntity.color;
        hoverEntity.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CHARTREUSE);
    }
    else {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.color = hoverPrevColor;
            hoverEntity = undefined;
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

let getPrimitiveFromPrimitiveId = function (primitiveId) {
    return scene.primitives.get(1).getGeometryInstanceAttributes(primitiveId);
};


$("#zoomSelector").change(function () {
    let selectedCityBox = $("#zoomSelector").find("option:selected");
    let cityName = selectedCityBox.val();
    if (cityName.localeCompare("") !== 0) {
        let cityId = selectedCityBox.attr('id').split('_')[1];
        $.ajax({
                   url: SERVER_URL + "city/" + cityName,
                   type: "GET",
                   success: function (data) {
                       let coords = createRing(data.boundCoords);
                       let maxLat = Number(coords[0].split(" ")[0]);
                       let maxLng = Number(coords[1].split(" ")[1]);

                       let minLat = Number(coords[1].split(" ")[0]);
                       let minLng = Number(coords[0].split(" ")[1]);

                       let centroidLat = (maxLat + minLat) / 2;
                       let centroidLng = (maxLng + minLng) / 2;
                       viewer.camera.flyTo({
                                               destination: Cesium.Cartesian3.fromDegrees(centroidLng, centroidLat, 10000),
                                           });
                       loadObjs(cityId)
                   }
               })
    }
}).change();

$("#shadows").change(function () {
    let shadowsStatus = false;
    if (this.checked) {
        shadowsStatus = true;
    }

    for (let i = 0; i < viewer.scene.primitives.length; i++) {
        if (viewer.scene.primitives.get(i).appearance !== undefined) {
            viewer.scene.primitives.get(i).appearance.translucent = shadowsStatus;
        }
    }
});

$("#translucence").change(function () {
    if (this.checked) {
        translucenceStatus = 0.5;
    } else {
        translucenceStatus = 1;
    }

    for (let i = 0; i < viewer.scene.primitives.length; i++) {
        if (viewer.scene.primitives.get(i).appearance !== undefined) {
            viewer.scene.primitives.get(i).appearance.material.uniforms.color.alpha = translucenceStatus;
        }
    }
    if (selectedEntity !== undefined) {
        selectedEntity.primitive.appearance.material.uniforms.color.alpha = 1;
    }

});


$("#colorByHeight").change(function () {
    if (this.checked) {
        for (let i = 0; i < viewer.scene.primitives.get(1).geometryInstances.length; i++) {
            let primitive = getPrimitiveFromPrimitiveId(viewer.scene.primitives.get(1).geometryInstances[i].id);
            if (viewer.scene.primitives.get(1).geometryInstances[i].geometry !== undefined) {
                let buildingHeight = viewer.scene.primitives.get(1).geometryInstances[i].geometry._height
                                     - viewer.scene.primitives.get(1).geometryInstances[i].geometry._extrudedHeight;
                let newRGB = interpolateColors(parseInt(buildingHeight), parseInt(MAX_HEIGHT), [0, 0, 1], [1, 0, 0]);
                primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(newRGB[0], newRGB[1], newRGB[2], 1.0));
            }
        }
    } else {
        setDefaultColors();
    }
});

// $('#coloring input').on('change', function () {
//     let selectedRadio = $('input[name=coloring]:checked', '#coloring').val();
//     if (selectedRadio === "height") {
//         $('#colorPicker').attr("disabled", true);
//
//     } else {
//         $('#colorPicker').attr("disabled", false);
//         setDefaultColors();
//     }
// });

$('#colorPicker').on('change', function () {
    let selectedRadio = $('input[name=coloring]:checked', '#coloring').val();
    if (selectedRadio === "default") {
        setDefaultColors();
    }
});

$('#resetColors').click(function () {
    setDefaultColors();
});

let setDefaultColors = function () {
    for (let i = 0; i < viewer.scene.primitives.get(1).geometryInstances.length; i++) {
        let primitive = getPrimitiveFromPrimitiveId(viewer.scene.primitives.get(1).geometryInstances[i].id);
        if (primitive !== undefined) {
            primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);
            if (primitive === selectedEntity) {
                primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);

            }
        }
    }
    hoverPrevColor = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);
    selectPrevColor = hoverPrevColor;
};

let triggerCreditButton = function () {

    let creditsBox = $("#credits-box");
    $("#credits-button").click(function (e) {
        e.stopPropagation();

        if (creditsBox.hasClass("cesium-navigation-help-visible")) {
            creditsBox.removeClass("cesium-navigation-help-visible");
        } else {
            creditsBox.addClass("cesium-navigation-help-visible");
        }
    });
};

$('#cesiumContainer').click(function () {
    let creditsBox = $("#credits-box");
    if (creditsBox.hasClass("cesium-navigation-help-visible")) {
        creditsBox.removeClass("cesium-navigation-help-visible");
    }
});

$('#queryFromBuildingCity').click(function () {
    setDefaultColors();
    let typeId = $("#buildingTypeCity option:selected").attr("id");
    if (typeId !== undefined) {
        $.ajax({
                   url: SERVER_URL + "building/type/" + typeId,
                   type: "GET",
                   success: function (data) {
                       for (let j = 0; j < data.buildingIds.length; j++) {
                           for (let i = 0; i < viewer.scene.primitives.length; i++) {
                               if (viewer.scene.primitives.get(i).geometryInstances !== undefined) {
                                   if (parseInt((viewer.scene.primitives.get(i).geometryInstances.id).split("_")[1]) === parseInt(data.buildingIds[j])) {
                                       console.log("Match");
                                       viewer.scene.primitives.get(i).appearance.material.uniforms.color = Cesium.Color.fromCssColorString("#FF0000");
                                   }
                               }
                           }
                       }
                   }

               })
    }
})
;

let loadInfoBox = function (buildingId) {
    $.ajax({
               url: SERVER_URL + 'building/info/' + buildingId,
               type: "GET",
               success: function (data) {
                   GLOBALSELECTION = data;
                   viewer.selectedEntity = new Cesium.Entity({
                                                                 id: selectedEntity.id,
                                                                 description: generateTable(data)
                                                             });
                   setTimeout(function () {
                       if (miniCanvasScene !== undefined) {
                           miniCanvasScene.dispose();
                       }
                       miniCanvasScene = createMiniCanvas(data);
                       loadTypesForInfoBox();
                   }, 50)
               }
           });
};

let loadTypesForInfoBox = function () {
    $.ajax({
               url: SERVER_URL + "type/getall",
               type: "GET",
               success: function (data) {
                   let iframe = document.getElementsByClassName('cesium-infoBox-iframe');
                   let innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
                   for (let i = 0; i < data.length; i++) {
                       let opt = document.createElement("OPTION");
                       let val = document.createTextNode(formatText(data[i].typeName));
                       opt.id = data[i].id;
                       opt.value = data[i].typeName;
                       opt.appendChild(val);
                       innerDoc.getElementById('buildingType').appendChild(opt);
                   }
               }
           });
};

// TODO: ALL BUILDINGS WHITE IS A BUTTON
// TODO: COLOR BY HEIGHT IS ONE OF THE QUERIES