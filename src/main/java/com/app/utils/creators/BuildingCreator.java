package com.app.utils.creators;

import com.app.models.Building;
import com.app.models.City;
import com.app.utils.Converter;
import com.app.utils.dataStructures.Pair;

import org.jetbrains.annotations.Contract;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

/**
 * Created by Andrea on 15/03/2017.
 */
public class BuildingCreator {

    public Building create(NodeList valuesList, City city) {
        Building building = new Building(city);
        for (int valueIdx = 0; valueIdx < valuesList.getLength(); valueIdx++) {
            Node node = valuesList.item(valueIdx);

            if (node.getFirstChild() != null) {
                String value = node.getFirstChild().getTextContent();
                switch (valueIdx) {
                    case 1:
                        this.getBuildingCoordinates(node, building);
                        break;
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

    private void getBuildingCoordinates(Node node, Building building) {
        NodeList valueNodesList = node.getChildNodes();
        if (valueNodesList != null) {
            NodeList boundList = valueNodesList.item(3).getChildNodes();
            if (boundList != null) {
                List<Pair<Double, Double>> coordinates = new ArrayList<>();
                for (int extentIdx = 0; extentIdx < boundList.getLength(); extentIdx += 2) {
//                    coordinates.add(this.createConvertedPair(boundList.item(extentIdx), boundList.item(extentIdx + 1)));
                    coordinates.add(this.createPair(boundList.item(extentIdx), boundList.item(extentIdx + 1)));
                }
                Pair<Double, Double> centroidCoords = this.computeCentroid(coordinates);
                building.setCentroidLat(centroidCoords.getL());
                building.setCentroidLng(centroidCoords.getR());
                building.setBoundCoords(this.createBinaryPoints(coordinates));
            }

            NodeList ringList = valueNodesList.item(4).getFirstChild().getFirstChild().getChildNodes();
            if (ringList != null) {
                List<Pair<Double, Double>> coordinates = new ArrayList<>();
                for (int ringIdx = 0; ringIdx < ringList.getLength(); ringIdx++) {
                    coordinates.add(this.createPair(ringList.item(ringIdx).getFirstChild(), ringList.item(ringIdx).getLastChild()));
//                    coordinates.add(this.createConvertedPair(ringList.item(ringIdx).getFirstChild(), ringList.item(ringIdx).getLastChild()));
                }
                building.setRingSwissCoords(this.createBinaryPoints(coordinates));
            }
        }
    }

    private Pair<Double, Double> createConvertedPair(Node value1, Node value2) {
        Double xCoord = Double.parseDouble(value1.getTextContent());
        Double yCoord = Double.parseDouble(value2.getTextContent());

        // Convert coordinates from CH1903 to GWC
        Double latitude = Converter.CHtoWGSlat(xCoord, yCoord);
        Double longitude = Converter.CHtoWGSlng(xCoord, yCoord);
        return new Pair<>(latitude, longitude);
    }

    private Pair<Double, Double> createPair(Node value1, Node value2) {
        Double xCoord = Double.parseDouble(value1.getTextContent());
        Double yCoord = Double.parseDouble(value2.getTextContent());
        return new Pair<>(xCoord, yCoord);
    }

    @Contract(pure = true)
    private byte[] createStingifiedXml(List<Pair<Double, Double>> coordinates) throws ParserConfigurationException, TransformerException {
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        // root elements
        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement("Points");
        doc.appendChild(rootElement);


        for (Pair<Double, Double> pointCoords : coordinates) {
            Element point = doc.createElement("Point");
            point.setAttribute("Latitude", String.valueOf(pointCoords.getL()));
            point.setAttribute("Longitude", String.valueOf(pointCoords.getR()));
            rootElement.appendChild(point);
        }

        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));

        return (writer.getBuffer().toString().replaceAll("\n|\r", "")).getBytes();

    }

    @Contract(pure = true)
    private byte[] createBinaryPoints(List<Pair<Double, Double>> coordinates) {
        String pointsString = "";

        for (Pair<Double, Double> point : coordinates) {
            pointsString += point.getL() + " " + point.getR() + ',';
        }

        if (pointsString.length() > 0) {
            pointsString = pointsString.substring(0, pointsString.length() - 1);
        }

        return pointsString.getBytes();
    }

    private Pair<Double, Double> computeCentroid(List<Pair<Double, Double>> xyCoord) {
        String centroidCoords = "";
        Double lat = 0.0;
        Double lng = 0.0;
        for (Pair<Double, Double> point : xyCoord) {
            lat += point.getL();
            lng += point.getR();
        }
        return new Pair<>(lat/2, lng/2);
    }


    private String getCivicNumber(String value) {
        String civicAddress;
        if (value.length() == 9) {
            civicAddress = value.substring(5);
        } else {
            civicAddress = value.substring(4);
        }
        return civicAddress.replaceFirst("^0+(?!$)", "");
    }
}