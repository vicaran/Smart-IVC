package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PostPersist;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * The type Suburb.
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

    @OneToMany(mappedBy = "ownSuburb", cascade = CascadeType.ALL)
    private Collection<Building> buildings = new ArrayList<>();


    /**
     * Instantiates a new Suburb.
     */
// JPA REQUIRES IT!
    public Suburb() {
    }

    /**
     * Instantiates a new Suburb.
     *
     * @param city the city
     * @param name the name
     */
    public Suburb(City city, String name) {
        this.setCity(city);
        this.setName(name);
    }

    /**
     * Gets city.
     *
     * @return the city
     */
    @JsonIgnore
    public City getCity() {
        return ownCity;
    }

    /**
     * Sets city.
     *
     * @param city the city
     */
    public void setCity(City city) {
        this.ownCity = city;
        city.addSuburb(this);
    }

    /**
     * Add building.
     *
     * @param building the building
     */
    public void addBuilding(Building building){
//        if (buildings.contains(building))
//            return;
        buildings.add(building);
        building.setSuburb(this);
    }

    /**
     * Gets buildings.
     *
     * @return the buildings
     */
    @JsonIgnore
    public Collection<Building> getBuildings() {
        return new ArrayList<Building>(buildings);
    }

//    public void removeBuilding(Building building) {
//        if (!buildings.contains(building))
//            return;
//        buildings.remove(building);
//        building.setSuburb(null);
//    }

    /**
     * Sets buildings.
     *
     * @param buildings the buildings
     */
    public void setBuildings(Collection<Building> buildings) {
        this.buildings = buildings;
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
     * Get bound coords byte [ ].
     *
     * @return the byte [ ]
     */
    @JsonIgnore
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
     * Gets building ids.
     *
     * @return the building ids
     */
    @Transient
    public List<Long> getBuildingIds () {
        List<Long> buildingIds = new LinkedList<>();
        Collection<Building> buildingList = getBuildings();
        if (buildingList != null) {
            for (Building building : buildingList)
                buildingIds.add(building.getId());
        }
        return buildingIds;
    }
}
