package com.app.utils.creators;

import com.app.API.GoogleGeocoding.GoogleAPIServices;
import com.app.API.GoogleGeocoding.LocationInfo;
import com.app.models.Address;
import com.app.models.Building;
import com.app.models.City;
import com.app.utils.FileLoader;
import com.app.utils.dataStructures.Pair;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Andrea on 15/03/2017.
 */
public class CityCreator {

    private List<Building> buildingList;
    private List<Address> addressList;
    private City cityModel;
    private Document cityDocument;

    /**
     * Instantiates a new City creator.
     *
     * @param cityPath the city path
     * @param name     the name
     * @param zip      the zip
     * @throws Exception the exception
     */
    public CityCreator(String cityPath, String name, String zip) throws Exception {
        this.cityDocument = FileLoader.loadFile(cityPath);
        this.buildingList = new ArrayList<>();
        this.addressList = new ArrayList<>();
        this.initializeCity(name, zip);
        this.create();
    }

    /**
     * Instantiates a new City creator.
     */
    public CityCreator(){}

    private void initializeCity(String name, String zip) throws Exception {
        this.cityModel = new City(name, zip);

        GoogleAPIServices APIlocation = new LocationInfo();
        HashMap<String, String> additionalInfo = APIlocation.cityInfo(name);

        if (additionalInfo.get("country") != null) {
            this.cityModel.setCountry(additionalInfo.get("country"));
        }
        if (additionalInfo.get("area") != null) {
            this.cityModel.setArea(additionalInfo.get("area"));
        }
        if (additionalInfo.get("bounds") != null) {
            this.cityModel.setBoundCoords(additionalInfo.get("bounds").getBytes());
        }
    }

    private void create() throws Exception {
        NodeList recordsList = this.getCityDocument().getElementsByTagName("Record");
        if (recordsList != null) {
            for (int recordIdx = 0; recordIdx < recordsList.getLength(); recordIdx++) {
                NodeList valuesList = recordsList.item(recordIdx).getFirstChild().getChildNodes();
                if (valuesList != null) {
                    BuildingCreator building = new BuildingCreator();
                    Pair<Building, Address> createdBuilding = building.create(valuesList, this.cityModel);
                    buildingList.add(createdBuilding.getL());
                    addressList.add(createdBuilding.getR());
                }
            }
        }
    }

    private Document getCityDocument() throws Exception {
        if (cityDocument == null) {
            throw new FileNotFoundException("File not found!");
        }
        return cityDocument;
    }

    /**
     * Gets city model.
     *
     * @return the city model
     */
    public City getCityModel() {
        return cityModel;
    }

    /**
     * Gets building list.
     *
     * @return the building list
     */
    public List<Building> getBuildingList() {
        return buildingList;
    }

    /**
     * Gets address list.
     *
     * @return the address list
     */
    public List<Address> getAddressList() {
        return addressList;
    }
}
