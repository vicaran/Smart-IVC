/**
 * Created by Andrea on 08/04/2017.
 */

let selectedEntity = undefined;
let hoverEntity = undefined;
let miniCanvasEngine = undefined;
let hoverPrevColor = undefined;
let selectPrevColor = undefined;

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (click) {
    let pickedObject = viewer.scene.pick(click.position);
    if (pickedObject !== undefined && getPrimitiveFromPrimitiveId(pickedObject.id) !== selectedEntity) {
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
    let selectedPrimitive = undefined;
    for (let i = 1; i < scene.primitives.length; i++) {
        let foundPrimitive = scene.primitives.get(i).getGeometryInstanceAttributes(primitiveId);
        if (foundPrimitive !== undefined) {
            selectedPrimitive = foundPrimitive;
            break;
        }
    }
    return selectedPrimitive;
};


$("#zoomSelector").change(function () {
    let selectedCityBox = $("#zoomSelector").find("option:selected");
    let cityName = selectedCityBox.val();
    if (cityName !== undefined && cityName.localeCompare("") !== 0) {
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
                       console.log(maxLat + " " + maxLng);
                       console.log(minLat + " " + minLng);
                       viewer.camera.flyTo({
                                               destination: Cesium.Cartesian3.fromDegrees(centroidLng - 0.031177, centroidLat - 0.034978, 9000),
                                               orientation: {
                                                   heading: 0.0,
                                                   pitch: Cesium.Math.toRadians(-70.0),
                                                   roll: viewer.camera.roll
                                               }
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

$("#colorByHeight").change(function () {

    if (this.checked) {
        setColorByHeight();
        createLegend();
    } else {
        setDefaultColors();
        destroyLegend();
    }
});

// $('#colorPicker').on('change', function () {
//     let selectedRadio = $('input[name=coloring]:checked', '#coloring').val();
//     if (selectedRadio === "default") {
//         setDefaultColors();
//     }
// });

$('#resetColors').click(function () {
    setDefaultColors();
});

let setColorByHeight = function () {
    for (let j = 1; j < scene.primitives.length; j++) {
        for (let i = 0; i < viewer.scene.primitives.get(j).geometryInstances.length; i++) {
            let primitive = getPrimitiveFromPrimitiveId(viewer.scene.primitives.get(j).geometryInstances[i].id);

            if (viewer.scene.primitives.get(j).geometryInstances[i].geometry !== undefined) {
                let buildingHeight = viewer.scene.primitives.get(j).geometryInstances[i].geometry._height
                                     - viewer.scene.primitives.get(j).geometryInstances[i].geometry._extrudedHeight;
                let newRGB = interpolateColors(parseInt(buildingHeight), parseInt(MAX_HEIGHT), [1, 1, 0], [0, 0, 1]);
                primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(newRGB[0], newRGB[1], newRGB[2], 1.0));
            }
        }
    }
};

let createLegend = function () {
    destroyLegend();
    let legend = '';
    let legendUl = $("#list_legend");
    for (let i = 0; i < MAX_HEIGHT; i++) {
        let color = interpolateColors(parseInt(i), parseInt(MAX_HEIGHT), [1, 1, 0], [0, 0, 1]);
        legend +=
            '<li>'
            + '<span style="background-color:#' + RGBToHex(color[0], color[1], color[2]) + ';">'
            + '</span>'
            + '</li>';
    }
    legendUl.append(legend);
    legendUl.show();
};

let destroyLegend = function () {
    let legendUl = $("#list_legend");
    if (legendUl !== undefined) {
        legendUl.hide();
        legendUl.empty();
    }
};

let setDefaultColors = function () {

    if ($("#colorByHeight:checked").length === 1) {
        $("#colorByHeight").prop('checked', false);
    }

    for (let j = 1; j < scene.primitives.length; j++) {
        for (let i = 0; i < viewer.scene.primitives.get(j).geometryInstances.length; i++) {
            let primitive = getPrimitiveFromPrimitiveId(viewer.scene.primitives.get(j).geometryInstances[i].id);
            if (primitive !== undefined) {
                primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);
                if (primitive === selectedEntity) {
                    primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                }
            }
        }
    }
    hoverPrevColor = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);
    selectPrevColor = hoverPrevColor;
};

//language=JQuery-CSS
$('#cesiumContainer').click(function () {
    let creditsBox = $("#credits-box");
    if (creditsBox.hasClass("cesium-navigation-help-visible")) {
        creditsBox.removeClass("cesium-navigation-help-visible");
    }
});

//language=JQuery-CSS
$('#queryFromBuildingCity').click(function () {
    setDefaultColors();

    let queryVal = queryBuilder();
    if (queryVal === "") {
        return;
    }
    $.ajax({
               url: SERVER_URL + "building/" + queryVal + "/",
               type: "GET",
               success: function (data) {
                   for (let i = 0; i < data.buildingIds.length; i++) {
                       let primitive = getPrimitiveFromPrimitiveId("building_" + data.buildingIds[i]);
                       if (primitive !== undefined) {
                           console.log("Match");
                           primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKORANGE);
                       }
                   }
               }
           })

})
;

let queryBuilder = function () {
    let query = '';
    if ($("#byTypeSelection:checked").length === 1) {
        query += "type/" + $("#buildingTypeCity").find("option:selected").attr("id");
        return query;
    }
    if ($("#byFloorsSelection:checked").length === 1) {
        let comparisonVal = $("#buildingFloorsComparisonCity").val();
        let floorsNumber = $("#floorsNumber").val();
        if (comparisonVal !== null && floorsNumber !== "") {
            return query += "floors/" + comparisonVal + "/" + floorsNumber;
        }
        return query;
    }
    return query;
};

let loadInfoBox = function (buildingId) {
    $.ajax({
               url: SERVER_URL + 'building/info/' + buildingId,
               type: "GET",
               success: function (data) {
                   viewer.selectedEntity = new Cesium.Entity({
                                                                 id: "Selected Building",
                                                                 description: generateTable(data)
                                                             });
                   setTimeout(function () {
                       if (miniCanvasEngine !== undefined) {
                           miniCanvasEngine.dispose();
                       }
                       miniCanvasEngine = createMiniCanvas(data, miniCanvasEngine);
                       loadTypesForInfoBox();
                   }, 200)
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

// TODO: CLICK BUILDING, SHOW NEAR BUILDINGS W.R.T. THE SELECTED BUILDING

// TODO: QUERY TO FIND THE NEAREST POINT (PUT SUBURB IN EVERY BUILDING)
// TODO: SIDE MENU WHERE YOU CAN FIND THE HISTORY OF YOUR QUERIES AND EXECUTE QUERIES ON THEM
// TODO: IN FIRST TAB YOU HAVE THE POSSIBILITY TO SELECT SUBURBS WITH CHECKBOXES
// TODO: IN SECOND TAB YOU HAVE QUERY SQL LIKE : SELECT ALL BUILDINGS WHERE FLOORS > 3