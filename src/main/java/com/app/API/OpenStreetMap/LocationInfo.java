package com.app.API.OpenStreetMap;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

/**
 * Created by Andrea on 30/03/2017.
 */
public class LocationInfo implements OpenStreetMapAPIServices {

    @Override
    public HashMap<String, String> buildingInfo(Double latitude, Double longitude) {
        HashMap<String, String> result = new HashMap<String, String>();
        HttpResponse<String> response = null;

        String composedUrl = OpenStreetMapGeocodingUrl + "&lat=" + latitude + "&lon=" + longitude + "&zoom=20&addressdetails=1";
        try {
            response = Unirest.get(composedUrl).asString();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        if (response != null && response.getStatus() == 200) {
            Document xmlResponse = null;
            try {
                xmlResponse = parseStringAsXML(response.getBody());
            } catch (IOException e) {
                e.printStackTrace();
            } catch (SAXException e) {
                e.printStackTrace();
            }
            result = checkExistenceAndPut(xmlResponse, result);
        }
        return result;
    }

    @Override
    public String[] getFields() {
        return fields;
    }

    private Document parseStringAsXML(String xml) throws IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = factory.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
        InputSource is = new InputSource(new StringReader(xml));
        return builder.parse(is);
    }

    private HashMap<String, String> checkExistenceAndPut(Document xml, HashMap<String, String> result) {

        for (String field : fields) {
            System.out.println(field);
            System.out.println(xml.getElementById(field));
            if (xml.getElementById(field) != null) {
                result.put(field + "Name", xml.getElementsByTagName("road").item(0).getFirstChild().getTextContent());
            }
        }
        return result;
    }
}
