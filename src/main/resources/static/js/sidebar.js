/**
 * Created by Andrea on 09/05/2017.
 */

let activeMenu = undefined;
let opened = false;

let isSelected = function (activeSelector) {
    if (activeSelector.hasClass("active")) {
        return true;
    }
    if ($("#visualize_menu_selector").hasClass("active")) {
        $("#visualize_menu_selector").removeClass("active");
        $("#visualize_menu").removeClass("in active");
    } else if ($("#queryCity_menu_selector").hasClass("active")) {
        $("#queryCity_menu_selector").removeClass("active");
        $("#queryCity_menu").removeClass("in active");
    } else if ($("#queryHistory_menu_selector").hasClass("active")) {
        $("#queryHistory_menu_selector").removeClass("active");
        $("#queryHistory_menu").removeClass("in active");
    } else if ($("#initial_menu").hasClass("in active")) {
        $("#initial_menu").removeClass("in active");
    } else if ($("#credits_menu").hasClass("in active")) {
        $("#credits_menu_selector").removeClass("active");
        $("#credits_menu").removeClass("in active");
    }
    return false;
};

let handleSidebar = function () {
    if (opened) {
        hideActive();
    } else {
        if (activeMenu !== undefined) {
            activeMenu.show();
        }
    }
    opened = !opened;
};

let hideActive = function () {
    if ($("#visualize_menu_selector").hasClass("active")) {
        $("#visualize_menu").hide();
        activeMenu = $("#visualize_menu");
    } else if ($("#queryCity_menu_selector").hasClass("active")) {
        $("#queryCity_menu").hide();
        activeMenu = $("#queryCity_menu");
    } else if ($("#queryHistory_menu_selector").hasClass("active")) {
        $("#queryHistory_menu").hide();
        activeMenu = $("#queryHistory_menu");
    } else if ($("#initial_menu").hasClass("in active")) {
        $("#initial_menu").hide();
        activeMenu = $("#initial_menu");
    } else if ($("#credits_menu").hasClass("in active")) {
        $("#credits_menu").hide();
        activeMenu = $("#credits_menu");
    }
};

$("#visualize_menu_tab").click(function () {
    if (!isSelected($("#visualize_menu_selector"))) {
        $("#visualize_menu_selector").addClass("active");
        $("#visualize_menu").addClass("in active");
    }
});

$("#queryCity_menu_tab").click(function () {
    if (!isSelected($("#queryCity_menu_selector"))) {
        $("#queryCity_menu_selector").addClass("active");
        $("#queryCity_menu").addClass("in active");
    }
});

$("#queryHistory_menu_tab").click(function () {
    if (!isSelected($("#queryHistory_menu_selector"))) {
        $("#queryHistory_menu_selector").addClass("active");
        $("#queryHistory_menu").addClass("in active");
    }
});

$("#credits_menu_tab").click(function () {
    if (!isSelected($("#credits_menu_selector"))) {
        $("#credits_menu_selector").addClass("active");
        $("#credits_menu").addClass("in active");
    }
});

$("#menu-hamburger").click(function () {
    if (!($("#visualize_menu_selector").hasClass("active") || $("#queryHistory_menu_selector").hasClass("active") || $("#queryCity_menu_selector")
            .hasClass("active") || $("#credits_menu_selector").hasClass("active"))) {
        $("#initial_menu").addClass("in active");
    }
    handleSidebar();
});

$("#sidebar_menu").hover(function(){
    if (!($("#visualize_menu_selector").hasClass("active") || $("#queryHistory_menu_selector").hasClass("active") || $("#queryCity_menu_selector")
            .hasClass("active") || $("#credits_menu_selector").hasClass("active"))) {
        $("#initial_menu").addClass("in active");
    }
    if (!opened) {
        if (activeMenu !== undefined) {
            activeMenu.show();
        }
        opened = !opened;
    }
});

$(document).click(function () {
    handleSidebar();
});
