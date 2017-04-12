/**
 * Created by Andrea on 29/03/2017.
 */

$(document).ready(function () {
    addCredits();
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


var addCredits = function () {
    $(".cesium-credit-textContainer").remove();
    var creditsReveal = '<span class="cesium-credit-image">'
                            + '<a href="http://reveal.inf.usi.ch/" target="_blank">'
                            + '<img src="/images/reveal/REVEALogo-black.png" alt="Reveal" title="Reveal" style="vertical-align: bottom;">'
                            + '</a>'
                        + '</span>';
    var creditsUsi = '<span class="cesium-credit-image">'
                         + '<a href="http://www.inf.usi.ch/" target="_blank">'
                         + '<img src="/images/reveal/logo_usi.png" alt="USI_INF" title="USI_INF" style="vertical-align: bottom;">'
                         + '</a>'
                     + '</span>';

    var gitHubLogo = '<span class="cesium-credit-image">'
                     + '<a href="https://github.com/vicaran/Smart-IVC" target="_blank">'
                     + '<img src="/images/reveal/githubLogo.png" alt="GITHUB_REPO" title="GITHUB_REPO" style="vertical-align: bottom;">'
                     + '</a>'
                     + '</span>';

    var creditsButton =  '<span class"cesium-credits-wrapper">'
                         + '<button type="button" class="cesium-button cesium-toolbar-button" title="Credits" id="credits-button">'
                            +'<image src="/images/copyright.png" width="32" height="32"/>'
                         + '</button>'
                         + '<div class="cesium-navigation-help" id="credits-box">'
                            + '<div class="cesium-click-navigation-help cesium-navigation-help-instructions cesium-click-navigation-help-visible">'
                            + '<table>'
                                + '<tbody>'
                                    + '<tr>'
                                         + '<td>'
                                             + '<div class="cesium-navigation-help-pan">Developed by</div>'
                                             + '<div class="cesium-navigation-help-details">Andrea Vicari</div>'
                                         + '</td>'
                                    + '</tr>'
                                    + '<tr>'
                                         + '<td>'
                                            + '<div class="cesium-navigation-help-pan">Under the supervision of</div>'
                                            + '<div class="cesium-navigation-help-details">Prof. Dr. <a href="http://www.inf.usi.ch/faculty/lanza/" target="_blank" class="links_style">Michele Lanza</a></div>'
                                            + '<div class="cesium-navigation-help-details">Dr.  <a href="http://www.inf.usi.ch/postdoc/mocci/" target="_blank" class="links_style">Andrea Mocci</a></div>'
                                             + '</td>'
                                    + '</tr>'
                                     + '<tr>'
                                         + '<td>'
                                             + '<div class="cesium-navigation-help-pan">Find it on GitHub</div>'
                                             + gitHubLogo
                                         + '</td>'
                                     + '</tr>'
                                + '</tbody>'
                            + '</table>'
                         + '</div>'
                     + '</div>'
                 + '</span>';

    $(".cesium-viewer-toolbar").append(creditsButton);

    $(".cesium-credit-imageContainer").append(creditsReveal);
    $(".cesium-credit-imageContainer").append(creditsUsi);
    triggerCreditButton();
};

