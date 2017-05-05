package com.app.utils;

import org.w3c.dom.Document;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

/**
 * Created by Andrea on 26/02/2017.
 */
public class FileLoader {

    /**
     * Load file document.
     *
     * @param filePath the file path
     * @return the document
     * @throws Exception the exception
     */
    static public Document loadFile(String filePath) throws Exception {
        File fXmlFile = new File(filePath);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(fXmlFile);
        doc.getDocumentElement().normalize();
        return doc;
    }
}