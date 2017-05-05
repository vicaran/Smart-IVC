package com.app.controllers;

/**
 * Created by Andrea on 18/03/2017.
 */


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * The type Home controller.
 */
@Controller
public class HomeController {

    /**
     * Show home cesium string.
     *
     * @return the string
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String showHomeCesium() {

        return "index";
    }

    /**
     * Show error string.
     *
     * @return the string
     */
    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public String showError() {

        return "error";
    }

}