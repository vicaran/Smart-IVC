package com.app.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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
    @Column(name = "BOUND_COORDINATES")
    private String boundCoords;
    @Column(name = "PERIMETER_COORDINATES")
    private String perimeterCoords;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="CITY_ID")
    private City city;

    // JPA REQUIRES IT!
    public Building() {
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

    public String getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(String boundCoords) {
        this.boundCoords = boundCoords;
    }

    public String getPerimeterCoords() {
        return perimeterCoords;
    }

    public void setPerimeterCoords(String perimeterCoords) {
        this.perimeterCoords = perimeterCoords;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
        if (!city.getBuildings().contains(this)) { // warning this may cause performance issues if you have a large data set since this operation is O(n)
            city.getBuildings().add(this);
        }
    }
}
