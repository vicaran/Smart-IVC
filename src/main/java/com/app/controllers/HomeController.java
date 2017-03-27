package com.app.controllers;

/**
 * Created by Andrea on 18/03/2017.
 */


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String showHome() {

        return "index";
    }

    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public String showError() {

        return "error";
    }

}