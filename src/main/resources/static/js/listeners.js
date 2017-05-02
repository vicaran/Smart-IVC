/**
 * Created by Andrea on 08/04/2017.
 */


var selectedEntity = undefined;
var hoverEntity = undefined;
var miniCanvasScene = undefined;

var translucenceStatus = 1;

var prevColor;
var GLOBALSELECTION;

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


handler.setInputAction(function (click) {
    var pickedObject = viewer.scene.pick(click.position);

    if (pickedObject !== undefined) {
        if (selectedEntity !== undefined) {
            selectedEntity.primitive.appearance.material.uniforms.color = prevColor;
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
        }
        selectedEntity = pickedObject;
        var complementColor = computeColorComplement($('#colorPicker').val());
        selectedEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString(complementColor);
        if (translucenceStatus === 0.5) {
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = 1;
        }
        $.ajax({
                   url: SERVER_URL + 'building/info/' + selectedEntity.id.substr(selectedEntity.id.indexOf("_") + 1),
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       GLOBALSELECTION = data;
                       viewer.selectedEntity = new Cesium.Entity({
                                                                                   id: selectedEntity.id,
                                                                                   description: generateTable(data)
                                                                 });
                       setTimeout(function () {
                           if (miniCanvasScene !== undefined) {
                               console.log("DISPOSING CANVAS");
                               miniCanvasScene.dispose();
                           }
                           miniCanvasScene = createMiniCanvas(data);
                           $.ajax({
                                      url: SERVER_URL + "type/getall",
                                      type: "GET",
                                      success: function (data, textStatus, jqXHR) {
                                          console.log("data is ");
                                          console.log(data);
                                          console.log(document.getElementsByClassName('cesium-infoBox-iframe'));

                                          var iframe = document.getElementsByClassName('cesium-infoBox-iframe');
                                          // var innerDoc = $('.cesium-infoBox-iframe').contents().find('buildingType')[0];

                                          console.log(iframe[0].contentDocument || iframe[0].contentWindow.document);
                                          var innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
                                          for (var i = 0; i < data.length; i++) {
                                              var opt = document.createElement("OPTION");
                                              var val = document.createTextNode(formatText(data[i].typeName));
                                              opt.id = data[i].id;
                                              opt.value = data[i].typeName;
                                              opt.appendChild(val);
                                              innerDoc.getElementById('buildingType').appendChild(opt);
                                          }
                                      }
                                  });

                       }, 10)
                   }
               });

    } else {
        if (selectedEntity !== undefined) {
            selectedEntity.primitive.appearance.material.uniforms.color = prevColor;
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
            selectedEntity = undefined;
        }
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function (movement) {
    var hoverObject = viewer.scene.pick(movement.endPosition);

    if (hoverObject !== undefined && hoverObject !== selectedEntity) {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.primitive.appearance.material.uniforms.color = prevColor;
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
        }
        hoverEntity = hoverObject;

        var complementColor = "#00ff23";
        prevColor = hoverEntity.primitive.appearance.material.uniforms.color;
        hoverEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString(complementColor);
        if (translucenceStatus === 1) {
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = 0.5;
        } else {
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = 1;
        }
    }
    else {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.primitive.appearance.material.uniforms.color = prevColor;
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
            hoverEntity = undefined;
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



$("#zoomSelector").change(function () {
    var cityName = $("#zoomSelector option:selected").text();
    if (cityName.localeCompare("Choose...") !== 0) {
        $.ajax({
                   url: SERVER_URL + "city/" + cityName,
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       var coords = createRing(data.boundCoords);
                       var maxLat = Number(coords[0].split(" ")[0]);
                       var maxLng = Number(coords[1].split(" ")[1]);

                       var minLat = Number(coords[1].split(" ")[0]);
                       var minLng = Number(coords[0].split(" ")[1]);



                       var centroidLat = (maxLat + minLat) / 2;
                       var centroidLng = (maxLng + minLng) / 2;

                       console.log(maxLat);
                       console.log(maxLng);
                       console.log(minLat);
                       console.log(minLng);
                       viewer.camera.flyTo({
                                                             destination: Cesium.Cartesian3.fromDegrees(centroidLng,
                                                                                                        centroidLat,
                                                                                                        15000),
                                                             maximumHeight: 10000,
                                                             // TODO: Pass max bounds of city and centroid to load city
                                                             // complete: cityLoader(maxLat, maxLng, minLat, minLng, centroidLat, centroidLng)
                                               // complete: cityLoader(maxLat, maxLng, minLat, minLng, 46.009447, 8.960488)
                                               complete: loadObjs()

                                                         });
                   }
               })
    }

}).change();

$("#shadows").change(function () {
    var shadowsStatus = false;
    if (this.checked) {
        shadowsStatus = true;
    }

    for (var i = 0; i < viewer.scene.primitives.length; i++) {
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

    for (var i = 0; i < viewer.scene.primitives.length; i++) {
        if (viewer.scene.primitives.get(i).appearance !== undefined) {
            viewer.scene.primitives.get(i).appearance.material.uniforms.color.alpha = translucenceStatus;
        }
    }
    if (selectedEntity !== undefined) {
        selectedEntity.primitive.appearance.material.uniforms.color.alpha = 1;
    }

});

$('#coloring input').on('change', function () {
    var selectedRadio = $('input[name=coloring]:checked', '#coloring').val();
    if (selectedRadio === "height") {
        $('#colorPicker').attr("disabled", true);
        for (var i = 0; i < viewer.scene.primitives.length; i++) {
            if (viewer.scene.primitives.get(i).geometryInstances !== undefined) {
                var buildingHeight = viewer.scene.primitives.get(i).geometryInstances.geometry._height
                                     - viewer.scene.primitives.get(i).geometryInstances.geometry._extrudedHeight;
                var newRGB = interpolateColors(parseInt(buildingHeight) , parseInt(MAX_HEIGHT), [0, 0, 1], [1, 0, 0]);
                viewer.scene.primitives.get(i).appearance.material.uniforms.color = new Cesium.Color(newRGB[0], newRGB[1], newRGB[2], 1.0)
            }
        }

    } else {
        $('#colorPicker').attr("disabled", false);
        setDefaultColors();
    }
});

$('#colorPicker').on('change', function () {
    var selectedRadio = $('input[name=coloring]:checked', '#coloring').val();
    if (selectedRadio === "default") {
        setDefaultColors();
    }
});

var setDefaultColors = function () {
    for (var i = 0; i < viewer.scene.primitives.length; i++) {
        if (viewer.scene.primitives.get(i).appearance !== undefined) {
            var alphaStatus = viewer.scene.primitives.get(i).appearance.material.uniforms.color.alpha;
            viewer.scene.primitives.get(i).appearance.material.uniforms.color = Cesium.Color.fromCssColorString($('#colorPicker').val());
            viewer.scene.primitives.get(i).appearance.material.uniforms.color.alpha = alphaStatus;
            if (selectedEntity !== undefined) {
                var complementColor = computeColorComplement($('#colorPicker').val());
                selectedEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString(complementColor);
            }
        }
    }
};

var triggerCreditButton = function () {

    var creditsBox = $("#credits-box");
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
    var creditsBox = $("#credits-box");
    if (creditsBox.hasClass("cesium-navigation-help-visible")) {
        creditsBox.removeClass("cesium-navigation-help-visible");
    }
});

$('#queryFromBuildingCity').click(function () {
    setDefaultColors();
    var typeId = $("#buildingTypeCity option:selected").attr("id");
    if (typeId !== undefined) {
        $.ajax({
                   url: SERVER_URL + "building/type/" + typeId,
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       for (var j = 0; j < data.buildingIds.length; j++) {
                           for (var i = 0; i < viewer.scene.primitives.length; i++) {
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

// TODO: Optimize query to visualize entire city
// TODO: refactor global variable MAX_HEIGHT
