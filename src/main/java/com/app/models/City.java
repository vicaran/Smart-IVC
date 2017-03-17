package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Created by Andrea on 12/03/2017.
 */
@Entity
@Table(name = "CITY")
public class City {

    @Id
    @Column(name = "CITY_ID", insertable = false, updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME")
    private String name;
    @Column(name = "ZIP")
    private String zip;
    @Column(name = "COUNTRY")
    private String country;
    @Column(name = "AREA")
    private String area;
    @Column(name = "BOUNDS")
    private byte[] boundCoords;
    @OneToMany(mappedBy="ownCity")
    private List<Building> buildings;

    // JPA REQUIRES IT!
    public City() {
    }

    public City(String name, String zip) {
        this.name = name;
        this.zip = zip;
        this.country = country;
        this.buildings = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    @JsonIgnore
    public List<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<Building> buildings) {
        this.buildings = buildings;
    }

    public void addBuilding(Building building){
        this.buildings.add(building);
        if (building.getCity() != this) {
            building.setCity(this);
        }
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public byte[] getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }
}
