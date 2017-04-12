/**
 * Created by Andrea on 08/04/2017.
 */


var selectedEntity = undefined;
var hoverEntity = undefined;
var translucenceStatus = 1;

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


handler.setInputAction(function (click) {
    var pickedObject = viewer.scene.pick(click.position);

    if (pickedObject !== undefined) {
        if (selectedEntity !== undefined) {
            selectedEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString($('#colorPicker').val());
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
        }
        selectedEntity = pickedObject;
        var complementColor = computeColorComplement($('#colorPicker').val());
        selectedEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString(complementColor);
        if (translucenceStatus === 0.5) {
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = 1;
        }
        console.log(selectedEntity);
    } else {
        if (selectedEntity !== undefined) {
            selectedEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString($('#colorPicker').val());
            selectedEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
            selectedEntity = undefined;
        }
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function (movement) {
    var hoverObject = viewer.scene.pick(movement.endPosition);

    if (hoverObject !== undefined && hoverObject !== selectedEntity) {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString($('#colorPicker').val());
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
        }
        hoverEntity = hoverObject;

        var complementColor = "#00ff23";
        hoverEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString(complementColor);
        if (translucenceStatus === 1) {
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = 0.5;
        } else {
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = 1;
        }
    }
    else {
        if (hoverEntity !== undefined && hoverEntity !== selectedEntity) {
            hoverEntity.primitive.appearance.material.uniforms.color = Cesium.Color.fromCssColorString($('#colorPicker').val());
            hoverEntity.primitive.appearance.material.uniforms.color.alpha = translucenceStatus;
            hoverEntity = undefined;
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



$("#zoomSelector").change(function () {
    var cityName = $("select option:selected").text()
    if (cityName.localeCompare("Choose...") !== 0) {
        $.ajax({
                   url: SERVER_URL + "city/" + cityName,
                   type: "GET",
                   success: function (data, textStatus, jqXHR) {
                       var coords = createRing(data.boundCoords);
                       var centroidLat = (Number(coords[0].split(" ")[1]) + Number(coords[1].split(" ")[1])) / 2;
                       var centroidLng = (Number(coords[0].split(" ")[0]) + Number(coords[1].split(" ")[0])) / 2;
                       viewer.camera.flyTo({
                                               destination: Cesium.Cartesian3.fromDegrees(centroidLat,
                                                                                          centroidLng,
                                                                                          14000)

                                           });
                       loadObjs();
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
                var newRGB = interpolateColors(viewer.scene.primitives.get(i).geometryInstances.geometry._height, MAX_HEIGHT, [0, 0, 1], [1, 0, 0]);
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




// TODO: VISUALIZE BUILDINGS BY HEIGHT
// TODO: Optimize query to visualize entire city
// TODO: refactor global variable MAX_HEIGHT
// TODO : study a way to get height of terrain and put building on elevation