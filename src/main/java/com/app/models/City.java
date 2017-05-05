package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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

    @OneToMany(mappedBy="ownCity", fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    private Set<Suburb> suburbs;

    /**
     * Instantiates a new City.
     */
// JPA REQUIRES IT!
    public City() {
    }

    /**
     * Instantiates a new City.
     *
     * @param name the name
     * @param zip  the zip
     */
    public City(String name, String zip) {
        this.name = name;
        this.zip = zip;
        this.country = country;
        this.buildings = new ArrayList<>();
        this.suburbs = new HashSet<>();
    }

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets zip.
     *
     * @return the zip
     */
    public String getZip() {
        return zip;
    }

    /**
     * Sets zip.
     *
     * @param zip the zip
     */
    public void setZip(String zip) {
        this.zip = zip;
    }

    /**
     * Gets buildings.
     *
     * @return the buildings
     */
    @JsonIgnore
    public List<Building> getBuildings() {
        return buildings;
    }

    /**
     * Sets buildings.
     *
     * @param buildings the buildings
     */
    public void setBuildings(List<Building> buildings) {
        this.buildings = buildings;
    }

    /**
     * Add building.
     *
     * @param building the building
     */
    public void addBuilding(Building building){
        this.buildings.add(building);
        if (building.getCity() != this) {
            building.setCity(this);
        }
    }

    /**
     * Gets suburbs.
     *
     * @return the suburbs
     */
    @JsonIgnore
    public Set<Suburb> getSuburbs() {
        return suburbs;
    }

    /**
     * Sets suburbs.
     *
     * @param suburbs the suburbs
     */
    public void setSuburbs(Set<Suburb> suburbs) {
        this.suburbs = suburbs;
    }

    /**
     * Add suburb.
     *
     * @param suburb the suburb
     */
    public void addSuburb(Suburb suburb){
        this.suburbs.add(suburb);
        if (suburb.getCity() != this) {
            suburb.setCity(this);
        }
    }

    /**
     * Gets country.
     *
     * @return the country
     */
    public String getCountry() {
        return country;
    }

    /**
     * Sets country.
     *
     * @param country the country
     */
    public void setCountry(String country) {
        this.country = country;
    }

    /**
     * Get bound coords byte [ ].
     *
     * @return the byte [ ]
     */
    public byte[] getBoundCoords() {
        return boundCoords;
    }

    /**
     * Sets bound coords.
     *
     * @param boundCoords the bound coords
     */
    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
    }

    /**
     * Gets area.
     *
     * @return the area
     */
    public String getArea() {
        return area;
    }

    /**
     * Sets area.
     *
     * @param area the area
     */
    public void setArea(String area) {
        this.area = area;
    }

    /**
     * Gets id.
     *
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(Long id) {
        this.id = id;
    }
}
