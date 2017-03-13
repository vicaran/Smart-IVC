import java.util.ArrayList;
import java.util.List;

import javax.xml.crypto.dom.DOMCryptoContext;

/**
 * Created by Andrea on 26/02/2017.
 */
public class Building {

    private String description;
    private int floors;
    private Double shapeLength;
    private Double shapeArea;
    private String civicAddress;
    private List<Pair<Double, Double>> envelopeList;
    private List<Pair<Double, Double>> ringList;

    public Building() {
        this.description = "";
        this.floors = 0;
        this.shapeLength = 0.0;
        this.shapeArea = 0.0;
        this.envelopeList = new ArrayList<Pair<Double, Double>>();
        this.ringList = new ArrayList<Pair<Double, Double>>();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getFloors() {
        return floors;
    }

    public void setFloors(int floors) {
        this.floors = floors;
    }

    public Double getShapeLength() {
        return shapeLength;
    }

    public void setShapeLength(Double shapeLength) {
        this.shapeLength = shapeLength;
    }

    public Double getShapeArea() {
        return shapeArea;
    }

    public void setShapeArea(Double shapeArea) {
        this.shapeArea = shapeArea;
    }

    @Override
    public String toString() {
        return this.getDescription();
    }

    public void addEnvelopeList(Pair<Double, Double> pairCoord) {
        this.envelopeList.add(pairCoord);
    }

    public List<Pair<Double, Double>> getRingList() {
        return ringList;
    }

    public void setRingList(List<Pair<Double, Double>> ringList) {
        this.ringList = ringList;
    }

    public void addPairRingList(Pair<Double, Double> pairCoord) {
        this.ringList.add(pairCoord);
    }

    public void printList() {
        for (Pair<Double, Double> p: this.ringList) {
            System.out.println("\t"+p.getL() + ", " + p.getR());
        }

        System.out.println("Boundaries are: ");
        for (Pair<Double, Double> p : this.envelopeList) {
            System.out.println("\t"+p.getL() + ", " + p.getR());
        }


    }

    public void setCivicAddress(String civicAddress) {
        this.civicAddress = civicAddress;
    }

    public String getCivicAddress() {
        return civicAddress;
    }
}
