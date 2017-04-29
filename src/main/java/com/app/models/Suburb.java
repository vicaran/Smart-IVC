package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Created by Andrea on 30/03/2017.
 */
@Entity
@Table(name = "SUBURB")
public class Suburb {

    @Id
    @Column(name = "SUBURB_ID", insertable = false, updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "NAME")
    private String name;
    @Column(name = "BOUNDS")
    private byte[] boundCoords;

    @ManyToOne()
    @JoinColumn(name = "OWNCITY_ID")
    private City ownCity;

    @OneToMany(mappedBy = "ownSuburb")
    private Collection<Building> buildings = new ArrayList<>();

    // JPA REQUIRES IT!
    public Suburb() {
    }

    public Suburb(City city, String name) {
        this.setCity(city);
        this.setName(name);
    }

    @JsonIgnore
    public City getCity() {
        return ownCity;
    }

    public void setCity(City city) {
        this.ownCity = city;
        city.addSuburb(this);
    }

    public void addBuilding(Building building){
//        if (buildings.contains(building))
//            return;
        buildings.add(building);
        building.setSuburb(this);
    }

    public Collection<Building> getBuildings() {
        return new ArrayList<Building>(buildings);
    }

//    public void removeBuilding(Building building) {
//        if (!buildings.contains(building))
//            return;
//        buildings.remove(building);
//        building.setSuburb(null);
//    }

    public void setBuildings(Collection<Building> buildings) {
        this.buildings = buildings;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
    }
}
