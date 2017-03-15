package com.app.utils;

import com.app.models.Building;
import com.app.models.City;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Andrea on 15/03/2017.
 */
public class CityCreator {

    private List<Building> buildingList;
    private Document cityDocument;

    public CityCreator(Document cityDocument) {
        this.cityDocument = cityDocument;
        this.buildingList = new ArrayList<>();
    }

    public List<Building> create(City city) throws Exception {
        NodeList recordsList = this.getCityDocument().getElementsByTagName("Record");
        if (recordsList != null) {
            for (int recordIdx = 0; recordIdx < recordsList.getLength(); recordIdx++) {
                NodeList valuesList = recordsList.item(recordIdx).getFirstChild().getChildNodes();
                if (valuesList != null) {
                    BuildingCreator building = new BuildingCreator();
                    buildingList.add(building.create(valuesList, city));
                }
            }
        }
        return buildingList;
    }

    private Document getCityDocument() throws Exception {
        if (cityDocument == null) {
            throw new FileNotFoundException("File not found!");
        }
        return cityDocument;
    }

}
