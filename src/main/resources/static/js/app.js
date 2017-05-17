/**
 * Created by Andrea on 29/03/2017.
 */
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

window.onload = function () {
    $(".cesium-viewer-toolbar").css("display", "inline-flex");
    hideLoadingGif();
    addCredits();
    loadCities();
    loadTypes();
    loadObjs("1");
};

let loadCities = function () {
    $.ajax({
               url: SERVER_URL + "city/allCityNames",
               type: "GET",
               success: function (data) {
                   for (let i = 0; i < data.length; i++) {
                       $("#zoomSelector").append('<option id="city_' + data[i].id + '" value="' + data[i].name + '">' + data[i].name + ' </option >');
                   }
               }
           })
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

let addCredits = function () {
    let cesiumCredits = $("#cesium_credits_div .cesium-credit-image");
    $("#powered_div").append(cesiumCredits.html());
    $("#cesium_credits_div").remove();
    // $("queryFromBuildingCity").attr("data-loading-text", '<i class="fa fa-circle-o-notch fa-spin"></i> Processing Query');
};


let loadTypes = function () {
    $.ajax({
               url: SERVER_URL + "type/getall",
               type: "GET",
               success: function (data) {
                   for (let i = 0; i < data.length; i++) {
                       let opt = document.createElement("OPTION");
                       let val = document.createTextNode(formatText(data[i].typeName));
                       opt.id = data[i].id;
                       opt.value = data[i].typeName;
                       opt.appendChild(val);
                       document.getElementById('buildingTypeCity').appendChild(opt);
                   }
               }
           });
};
