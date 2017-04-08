/**
 * Created by Andrea on 08/04/2017.
 */


var selectedEntity = [];

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (click) {
    var pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(viewer.entities.getById(selectedEntity[0]))) {
        viewer.entities.getById(selectedEntity[0]).polygon.material.color = selectedEntity[1];
    }
    if (Cesium.defined(pickedObject)) {
        var entityId = pickedObject.id._id;
        var oldColor = viewer.entities.getById(entityId).polygon.material.color;
        viewer.entities.getById(entityId).polygon.material.color = Cesium.Color.RED;
        selectedEntity[0] = entityId;
        selectedEntity[1] = oldColor;
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
                   }
               })
    }

}).change();