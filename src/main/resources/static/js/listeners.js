/**
 * Created by Andrea on 08/04/2017.
 */

let selectedEntity = undefined;
let selectedEntityId = undefined;
let hoverEntity = undefined;
let miniCanvasEngine = undefined;
let hoverPrevColor = undefined;
let selectPrevColor = undefined;

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (click) {
    let pickedObject = viewer.scene.pick(click.position);
    if (pickedObject !== undefined && getPrimitiveFromPrimitiveId(pickedObject.id) !== selectedEntity && typeof pickedObject.id === "string") {
        if (selectedEntity !== undefined) {
            selectedEntity.color = selectPrevColor;
        }
        selectedEntity = getPrimitiveFromPrimitiveId(pickedObject.id);
        selectPrevColor = hoverPrevColor;
        selectedEntity.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
        selectedEntityId = pickedObject.id.split("_")[1];
        loadInfoBox(pickedObject.id.split("_")[1]);
    } else if (pickedObject !== undefined && pickedObject.id._id !== undefined) {
        viewer.selectedEntity = undefined;
        WEBCAMS.forEach(function (webcam) {
            if (webcam.name === pickedObject.id._id) {
                showWebCam(webcam.id, webcam.url,webcam.name);
            }
        });
    } else {
        if (selectedEntity !== undefined) {
            selectedEntity.color = selectPrevColor;
            selectedEntity = undefined;
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function (movement) {
    let hoverObject = viewer.scene.pick(movement.endPosition);

    if (hoverObject !== undefined && getPrimitiveFromPrimitiveId(hoverObject.id) !== selectedEntity && typeof hoverObject.id === "string") {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.color = hoverPrevColor;
        }
        hoverEntity = getPrimitiveFromPrimitiveId(hoverObject.id);
        hoverPrevColor = hoverEntity.color;
        hoverEntity.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GOLD);
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
    if (typeof primitiveId === "string") {
        for (let i = 1; i < scene.primitives.length; i++) {
            let foundPrimitive = scene.primitives.get(1).getGeometryInstanceAttributes(primitiveId);
            if (foundPrimitive !== undefined) {
                selectedPrimitive = foundPrimitive;
                break;
            }
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

$("#geolocalizationPoint").change(function () {
    geolocalizationChangeVisibility();
});

$("#webcamPoints").change(function () {
    webCamsChangeVisibility();
});

$("#coloring").change(function () {
    let radioId = $("#coloring").find('input:radio:checked').attr('id');
    switch (radioId) {
        case "colorDefault":
            setDefaultColors();
            hideLegendIfVisible();
            break;
        case "colorByHeight":
            setColorByHeight();
            $("#legend-wrapper").removeClass("hidden-wrapper")
            break;
        case "colorBySuburb":
            setSuburbColors();
            hideLegendIfVisible();
            break;
    }
});

$("#suburbsTable").change(function () {
    let suburbsTable = $("#suburbsTable");
    suburbsTable.find('input:checkbox:not(:checked)').each(function () {
        let checkBoxId = $(this).attr("id").split("_")[1];
        if (SUBURBS_IDS[checkBoxId].visible) {
            for (let buildingIdx in SUBURBS_IDS[checkBoxId].buildingIds) {
                let primitive = getPrimitiveFromPrimitiveId("building_" + SUBURBS_IDS[checkBoxId].buildingIds[buildingIdx]);
                if (primitive !== undefined) {
                    primitive.show = Cesium.ShowGeometryInstanceAttribute.toValue(false);
                }
            }
            SUBURBS_IDS[checkBoxId].visible = 0;
        }
    });
    suburbsTable.find('input:checkbox:checked').each(function () {
        let checkBoxId = $(this).attr("id").split("_")[1];
        if (!SUBURBS_IDS[checkBoxId].visible) {
            for (let buildingIdx in SUBURBS_IDS[checkBoxId].buildingIds) {
                let primitive = getPrimitiveFromPrimitiveId("building_" + SUBURBS_IDS[checkBoxId].buildingIds[buildingIdx]);
                if (primitive !== undefined) {
                    primitive.show = Cesium.ShowGeometryInstanceAttribute.toValue(true);
                }
            }
            SUBURBS_IDS[checkBoxId].visible = 1;
        }
    })
});

let setSuburbColors = function () {
    for (let idx in SUBURBS_IDS) {
        for (let buildingIdx in SUBURBS_IDS[idx].buildingIds) {
            let primitive = getPrimitiveFromPrimitiveId("building_" + SUBURBS_IDS[idx].buildingIds[buildingIdx]);
            if (primitive !== undefined) {
                primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color.fromCssColorString(SUBURBS_IDS[idx].color))
                if (primitive === selectedEntity) {
                    viewer.selectedEntity = undefined;
                    selectedEntity = undefined;
                    selectedEntityId = undefined;
                    hoverEntity = undefined;
                }
            }
        }
    }
};

let setColorByHeight = function () {
    for (let j = 1; j < scene.primitives.length; j++) {
        if (viewer.scene.primitives.get(j).geometryInstances !== undefined) {
            for (let i = 0; i < viewer.scene.primitives.get(j).geometryInstances.length; i++) {
                let buildingID = viewer.scene.primitives.get(j).geometryInstances[i].id;
                let primitive = getPrimitiveFromPrimitiveId(buildingID);

                if (viewer.scene.primitives.get(j).geometryInstances[i].geometry !== undefined) {

                    let newRGB = interpolationByHeight(buildingFloors[buildingID], parseInt(MAX_HEIGHT));
                    primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(newRGB[0], newRGB[1], newRGB[2], 1.0));

                    if (primitive === selectedEntity) {
                        viewer.selectedEntity = undefined;
                        selectedEntity = undefined;
                        selectedEntityId = undefined;
                        hoverEntity = undefined;
                    }
                }
            }
        }

    }
};

let setDefaultColors = function () {
    for (let j = 1; j < scene.primitives.length; j++) {
        if (viewer.scene.primitives.get(j).geometryInstances !== undefined) {
            for (let i = 0; i < viewer.scene.primitives.get(j).geometryInstances.length; i++) {
                let primitive = getPrimitiveFromPrimitiveId(viewer.scene.primitives.get(j).geometryInstances[i].id);
                if (primitive !== undefined) {
                    primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);
                    if (primitive === selectedEntity) {
                        viewer.selectedEntity = undefined;
                        selectedEntity = undefined;
                        selectedEntityId = undefined;
                        hoverEntity = undefined;
                        // primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                    }
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
    let $this = $(this);


    let queryVal = queryBuilder();
    if (queryVal === "") {
        return;
    }
    showButtonSpinner($this);
    setDefaultColors();
    $.ajax({
               url: SERVER_URL + "building/query/" + queryVal + "/",
               type: "GET",
               success: function (data) {
                   renderQueryResult(data);
                   hideButtonSpinner($this);
                   addResultToHistory(queryVal, data);
                   unselectRadioButtonsColoring();
               },
               error: function (request, status, error) {
                   hideButtonSpinner($this);
               }
           })
})
;

$(".history_item").click(function () {
    let $this = $(this);
    renderQueryResult(SEARCH_HISTORY[$this.id]);
});

let renderQueryResult = function (data) {
    for (let i = 0; i < data.buildingIds.length; i++) {
        let primitive = getPrimitiveFromPrimitiveId("building_" + data.buildingIds[i]);
        if (primitive !== undefined) {
            primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKORANGE);
        }
    }
};

let queryBuilder = function () {
    let query = '';
    if ($("#byTypeSelection:checked").length === 1) {
        query += "type=" + $("#buildingTypeCity").find("option:selected").attr("id") + "&";
    }
    if ($("#byFloorsSelection:checked").length === 1) {
        let comparisonVal = $("#buildingFloorsComparisonCity").val();
        let floorsNumber = $("#floorsNumber").val();
        if (comparisonVal !== null && floorsNumber !== "") {
            query += "floors=" + comparisonVal + "_" + floorsNumber + "&";
        }
    }
    if ($("#byPrimarySecondarySelection:checked").length === 1) {
        let comparisonVal = $("#buildingPrimarySecondaryCity").val();
        let percentageVal = $("#primarySecondaryNumber").val();
        if (comparisonVal !== null && floorsNumber !== "") {
            query += "primarySecondaryPercentage=" + comparisonVal + "_" + percentageVal + "&";
        }
    }
    if ($("#bySuburbNameSelection:checked").length === 1) {
        query += "suburb=" + $("#buildingSuburbNameCity").find("option:selected").attr("id") + "&";
    }
    if ($("#byDistanceSelection:checked").length === 1) {
        let selectedProximity = $("#buildingDistanceCity").find("option:selected").val();
        let proximityQuery = "";
        if (selectedProximity === "myPosition") {
            proximityQuery += "latitude_" + geolocalizationCoords.latitude + "_longitude_" + geolocalizationCoords.longitude;
        } else if (selectedProximity === "selectedBuilding") {
            proximityQuery += "buildingId_" + selectedEntityId;
        }
        query += "proximity=" + proximityQuery + "&";
    }

    return query.slice(0, -1);
};

let loadInfoBox = function (buildingId) {
    $.ajax({
               url: SERVER_URL + 'building/info/' + buildingId,
               type: "GET",
               success: function (data) {
                   viewer.selectedEntity = new Cesium.Entity({
                                                                 id: "Selected Building (" + buildingId + ")",
                                                                 description: generateTable(data)
                                                             });
                   setTimeout(function () {
                       if (miniCanvasEngine !== undefined) {
                           miniCanvasEngine.dispose();
                       }
                       miniCanvasEngine = createMiniCanvas(data, miniCanvasEngine);
                       // loadTypesForInfoBox();
                   }, 150);
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

$('#coverageCity').click(function () {
    distanceMap($("#coverageTypeCity").find("option:selected").attr("id").split("_")[0]);
});

let distanceMap = function (buildingId) {
    setDefaultColors();

    $.ajax({
               url: SERVER_URL + "building/distanceMap/byTypeId=" + buildingId + "/",
               // url: SERVER_URL + "building/distanceQuery/buildingId=" + buildingId + "/",
               type: "GET",
               success: function (data) {
                   let hotSpots = [];

                   for (let i = 0; i < data.length; i++) {
                       let primitive = getPrimitiveFromPrimitiveId("building_" + data[i][0]);
                       if (primitive !== undefined) {

                           if (data[i][1] === 0) {
                               primitive.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                               hotSpots.push(data[i][0]);
                           } else if (!hotSpots.includes(data[i][0])) {
                               let newRGB = interpolateColors(data[i][1], [0, 1, 0], [1, 1, 1]);

                               let prevRed = primitive.color[0] / 255;
                               let prevGreen = primitive.color[1] / 255;
                               let prevBlue = primitive.color[2] / 255;

                               primitive.color =
                                   Cesium.ColorGeometryInstanceAttribute.toValue(
                                       new Cesium.Color(
                                           (prevRed + newRGB[0]) / 2 > prevRed ? prevRed : (prevRed + newRGB[0]) / 2,
                                           1,
                                           (prevBlue + newRGB[2]) / 2 > prevBlue ? prevBlue : (prevBlue + newRGB[2]) / 2,
                                           1.0));
                           }
                       }
                   }
                   unselectRadioButtonsColoring();
               },
               error: function (request, status, error) {
               }
           })
};

let selectBuildingById = function (id) {
    selectedEntity = getPrimitiveFromPrimitiveId("building_" + id);
    selectedEntity.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
};

$("#closeWebCamWrapper").click(function () {
    $("#webCamDiv").addClass("hidden-wrapper");
    $("#webCamTitle").html("");
    $("#webCamWrapper").find('object:first').remove();
});

let showWebCam = function (webCamId, webCamUrl, webcamName) {
    let objectTag = document.createElement("OBJECT");
    objectTag.id = webCamId + "_viewer";
    objectTag.width = "55%";
    objectTag.height = "100%";
    objectTag.className = "nivo-lightbox-item";
    objectTag.data = "http://www.lugano.ch/tools/webcam/" + webCamUrl + ".html?modal=true";
    $("#webCamWrapper").append(objectTag);
    $("#webCamTitle").html(webcamName);
    $("#webCamDiv").removeClass("hidden-wrapper");
};