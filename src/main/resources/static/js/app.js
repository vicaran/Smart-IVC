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
    let creditButton = $(".cesium-viewer-toolbar");
    let creditsReveal = '<span class="cesium-credit-image">'
                            + '<a href="http://reveal.inf.usi.ch/" target="_blank">'
                            + '<img src="/images/reveal/REVEALogo-black.png" alt="Reveal" title="Reveal" style="vertical-align: bottom;">'
                            + '</a>'
                        + '</span>';
    let creditsUsi = '<span class="cesium-credit-image">'
                         + '<a href="http://www.inf.usi.ch/" target="_blank">'
                         + '<img src="/images/reveal/logo_usi.png" alt="USI_INF" title="USI_INF" style="vertical-align: bottom;">'
                         + '</a>'
                     + '</span>';

    let gitHubLogo = '<span class="cesium-credit-image">'
                     + '<a href="https://github.com/vicaran/Smart-IVC" target="_blank">'
                     + '<img src="/images/reveal/githubLogo.png" alt="GITHUB_REPO" title="GITHUB_REPO" style="vertical-align: bottom;">'
                     + '</a>'
                     + '</span>';

    let creditsButton = '<span class"cesium-credits-wrapper">'
                        + '<button type="button" class="cesium-button cesium-toolbar-button" title="Credits" id="credits-button">'
                        + '<image src="/images/copyright.png" width="32" height="32"/>'
                        + '</button>'
                        + '<div class="cesium-navigation-help" id="credits-box">'
                        + '<div class="cesium-click-navigation-help cesium-navigation-help-instructions cesium-click-navigation-help-visible">'
                        + '<table class="credits-box">'
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
                        + '<div class="cesium-navigation-help-pan"></div>'
                        + creditsReveal
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td>'
                        + '<div class="cesium-navigation-help-pan">Bachelor Project at</div>'
                        + creditsUsi
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td>'
                        + '<div class="cesium-navigation-help-pan">Find it on GitHub</div>'
                        + gitHubLogo
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td>'
                        + '<div class="cesium-navigation-help-pan">Powered by</div>'
                        + cesiumCredits.html()
                        + '</td>'
                        + '</tr>'
                        + '</tbody>'
                        + '</table>'
                        + '</div>'
                        + '</div>'
                        + '</span>';
    // creditButton.append(creditsButton);
    $("#cesium_credits_div").remove();
    // $("#credits_menu").append(creditsButton);
    // triggerCreditButton();
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
