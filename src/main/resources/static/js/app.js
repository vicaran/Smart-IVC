/**
 * Created by Andrea on 29/03/2017.
 */

$(document).ready(function () {
    $(".cesium-credit-textContainer").remove();
    var creditsReveal = '<span class="cesium-credit-image"><a href="http://reveal.inf.usi.ch/" target="_blank"><img src="/images/reveal/REVEALogo-black.png" alt="Reveal" title="Reveal" style="vertical-align: bottom;"></a></span>';
    var creditsUsi = '<span class="cesium-credit-image"><a href="http://www.inf.usi.ch/" target="_blank"><img src="/images/reveal/logo_usi.png" alt="USI_INF" title="USI_INF" style="vertical-align: bottom;"></a></span>';

    $(".cesium-credit-imageContainer").append(creditsReveal);
    $(".cesium-credit-imageContainer").append(creditsUsi);

    // $("#side_menu").append()
    loadCities();

});

var loadCities = function () {
    $.ajax({
               url: SERVER_URL + "city/allCityNames",
               type: "GET",
               success: function (data, textStatus, jqXHR) {
                   for (var i = 0; i < data.length; i++) {
                       $("#zoomSelector").append('<option id=city_' + data[i].id + 'value=' + data[i].name + '>' + data[i].name + ' </option >');
                   }
               }
           })
};


