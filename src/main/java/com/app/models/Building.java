package com.app.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by Andrea on 12/03/2017.
 */
@Entity
@Table(name = "BUILDING")
public class Building {

    @Id
    @Column(name = "BUILDING_ID", insertable = false, updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "FLOORS")
    private int floors;
    @Column(name = "SHAPE_LENGTH")
    private double shapeLength;
    @Column(name = "SHAPE_AREA")
    private double shapeArea;
    @Column(name = "BOUNDS")
    private byte[] boundCoords;
    @Lob
    @Column(name = "RING")
    private byte[] ringCoords;
    @Column(name = "CIVIC_NUMBER")
    private String civicNumber;
    @Column(name = "CENTROID_LAT")
    private Double centroidLat;
    @Column(name = "CENTROID_LNG")
    private Double centroidLng;
    @ManyToOne()
    @JoinColumn(name="OWNCITY_ID")
    private City ownCity;

    // JPA REQUIRES IT!
    public Building() {
    }

    public Building(City city) {
        this.setCity(city);
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

    public double getShapeLength() {
        return shapeLength;
    }

    public void setShapeLength(double shapeLength) {
        this.shapeLength = shapeLength;
    }

    public double getShapeArea() {
        return shapeArea;
    }

    public void setShapeArea(double shapeArea) {
        this.shapeArea = shapeArea;
    }

    public City getCity() {
        return ownCity;
    }

    public void setCity(City city) {
        this.ownCity = city;
        if (!city.getBuildings().contains(this)) { // warning this may cause performance issues if you have a large data set since this operation is O(n)
            city.getBuildings().add(this);
        }
    }

    public String getCivicNumber() {
        return civicNumber;
    }

    public void setCivicNumber(String civicNumber) {
        this.civicNumber = civicNumber;
    }

    public byte[] getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
    }

    public byte[] getRingCoords() {
        return ringCoords;
    }

    public void setRingCoords(byte[] ringCoords) {
        this.ringCoords = ringCoords;
    }

    public Double getCentroidLat() {
        return centroidLat;
    }

    public void setCentroidLat(Double centroidLat) {
        this.centroidLat = centroidLat;
    }

    public Double getCentroidLng() {
        return centroidLng;
    }

    public void setCentroidLng(Double centroidLng) {
        this.centroidLng = centroidLng;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
