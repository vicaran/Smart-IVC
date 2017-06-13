/**
 * Created by Andrea on 29/03/2017.
 */
let SUBURBS_IDS = {};

// Load sidebar
let sidebarBox = document.querySelector('#box'),
    sidebarBtn = document.querySelector('#btn'),
    pageWrapper = document.querySelector('#page-wrapper');

sidebarBtn.addEventListener('click', function (event) {
    sidebarBtn.classList.toggle('active');
    sidebarBox.classList.toggle('active');
});

pageWrapper.addEventListener('click', function (event) {

    if (sidebarBox.classList.contains('active')) {
        sidebarBtn.classList.remove('active');
        sidebarBox.classList.remove('active');
    }
});

window.addEventListener('keydown', function (event) {

    if (sidebarBox.classList.contains('active') && event.keyCode === 27) {
        sidebarBtn.classList.remove('active');
        sidebarBox.classList.remove('active');
    }
});

$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

window.onload = function () {
    $(".cesium-viewer-toolbar").css("display", "inline-flex");
    hideLoadingGif();
    loadCities();
    loadTypes();
    loadSuburbs();
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

let loadSuburbs = function () {
    $.ajax({
               url: SERVER_URL + "suburb/fromCityId=1",
               type: "GET",
               success: function (data) {
                   // let colorStep = data.length/255;
                   for (let i = 0; i < data.length; i++) {
                       let generatedColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

                       SUBURBS_IDS[data[i].id] = {
                           "buildingIds": data[i].buildingIds,
                           "color": generatedColor,
                           "visible" : 1
                       };
                       let tableRow = '<tr>'
                                      + '<td class="tg-0ord">'
                                      + '<form class="nowrap">'
                                      + '<input id="suburb_' + data[i].id + '" name="bySuburb" value="suburbSelection" type="checkbox" checked/>'
                                      + '</form>'
                                      + '</td>'
                                      + '<td class="tg-031e alignment-suburb"><div class="suburb-color-square"><p style=" width: 30px;height: 23pt; background:'
                                      + generatedColor + '; margin-bottom: 0pt;"></p></div><p class="suburb-label">'
                                      + data[i].name + '</p></td>'
                                      + '</tr>';

                       $("#suburbsTable").append(tableRow);

                       let opt = document.createElement("OPTION");
                       let val = document.createTextNode(formatText(data[i].name));
                       opt.id = data[i].id;
                       opt.value = data[i].name;
                       opt.appendChild(val);
                       document.getElementById('buildingSuburbNameCity').appendChild(opt);
                   }
               }
           })

}

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
                       opt = document.createElement("OPTION");
                       val = document.createTextNode(formatText(data[i].typeName));
                       opt.id = data[i].id + "_cov";
                       opt.value = data[i].typeName;
                       opt.appendChild(val);
                       document.getElementById('coverageTypeCity').appendChild(opt);
                   }
               }
           });
};
