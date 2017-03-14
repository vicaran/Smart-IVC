package com.app.utils;

import com.app.models.Building;
import com.app.models.City;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

/**
 * Created by Andrea on 26/02/2017.
 */

public class Parser {

    private List<Building> buildingList;
    private Document cityDocument;

    public Parser(String filePath) throws Exception {
        this.cityDocument = this.loadFile(filePath);
        this.buildingList = new ArrayList<>();
    }

    private Document loadFile(String filePath) throws Exception {
        File fXmlFile = new File(filePath);
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(fXmlFile);
        doc.getDocumentElement().normalize();
        return doc;
    }

    public List<Building> createCity(City city) throws Exception {
        NodeList recordsList = this.getCityDocument().getElementsByTagName("Record");
        if (recordsList != null) {
            for (int recordIdx = 0; recordIdx < recordsList.getLength(); recordIdx++) {
                NodeList valuesList = recordsList.item(recordIdx).getFirstChild().getChildNodes();
                if (valuesList != null) {
                    buildingList.add(this.createBuilding(valuesList, city));
                }
            }
        }
        return buildingList;
    }

    private Building createBuilding(NodeList valuesList, City city) {
        Building building = new Building(city);
        for (int valueIdx = 0; valueIdx < valuesList.getLength(); valueIdx++) {
            Node node = valuesList.item(valueIdx);

            if (node.getFirstChild() != null) {
                String value = node.getFirstChild().getTextContent();
                switch (valueIdx) {
                    case 1:
                        this.getBuildingCoordinates(node, building);
                    case 4:
                        building.setDescription(value);
                        break;
                    case 6:
                        building.setCivicNumber(getCivicNumber(value));
                        break;
                    case 10:
                        building.setFloors(Integer.parseInt(value));
                        break;
                    case 11:
                        building.setShapeLength(Double.parseDouble(value));
                        break;
                    case 12:
                        building.setShapeArea(Double.parseDouble(value));
                        break;
                    default:
                        break;
                }
            }
        }
        return building;
    }

    private Document getCityDocument() throws Exception {
        if (cityDocument == null) {
            throw new FileNotFoundException("File not found!");
        }
        return cityDocument;
    }

    private void getBuildingCoordinates(Node node, Building building) {
        NodeList valueNodesList = node.getChildNodes();
        if (valueNodesList != null) {
            NodeList extentList = valueNodesList.item(3).getChildNodes();
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            if (extentList != null) {
                List<Pair<Double, Double>> xyCoord = new ArrayList<>();
                for (int extentIdx = 0; extentIdx < extentList.getLength(); extentIdx += 2) {
                    xyCoord.add(this.createPair(extentList.item(extentIdx), extentList.item(extentIdx+1)));
                }
                this.computeCentroid(xyCoord, building);
            }

//                NodeList ringList = valueNodesList.item(4).getFirstChild().getFirstChild().getChildNodes();
//                if (ringList != null) {
//                    for (int ringIdx = 0; ringIdx < ringList.getLength(); ringIdx++) {
//                        Pair<Double, Double> xyCoord = this.createPair(ringList.item(ringIdx).getFirstChild(), ringList.item(ringIdx).getLastChild());
////                    building.addPairRingList(xyCoord);
//                    }
//                }
        }
    }

    private Pair<Double, Double> createPair(Node value1, Node value2){

        Double xCoord = Double.parseDouble(value1.getTextContent());
        Double yCoord = Double.parseDouble(value2.getTextContent());

        // Convert coordinates from CH1903 to GWC
        Double latitude = Converter.CHtoWGSlat(xCoord, yCoord);
        Double longitude = Converter.CHtoWGSlng(xCoord, yCoord);
        return new Pair<Double, Double>(latitude, longitude);
    }

    private void computeCentroid(List<Pair<Double, Double>> xyCoord, Building building){
        Double lat = 0.0;
        Double lon = 0.0;

        for(Pair<Double, Double> point : xyCoord){
            lat+= point.getL();
            lon+= point.getR();
        }

        building.setCentroidLat(String.valueOf(lat/2));
        building.setCentroidLon(String.valueOf(lon/2));
    }

    private String getCivicNumber(String value){
        String civicAddress;
        if (value.length() == 9){
            civicAddress = value.substring(5);
        } else {
            civicAddress = value.substring(4);
        }
        return civicAddress.replaceFirst("^0+(?!$)", "");
    }

//    public void printCity() {
//        int i = 0;
//        for (Building build : buildingList) {
//            i++;
////            if (build.getCivicAddress() != null) {
////                String civic = build.getCivicAddress();
////                if (civic.substring(0, Math.min(civic.length(), 4)).equals("0082")) {
//                    System.out.println("Building " + i + " is an " + build + " with " + build.getFloors() + " floors.  Civic Address: " + build.getCivicNumber());
//                    System.out.println("Coordinates of perimeter are: ");
//                    build.printList();
//                    System.out.println();
////                }
////            }
//        }
//        System.out.println();
//        System.out.println(i + " buildings!");
//    }
}