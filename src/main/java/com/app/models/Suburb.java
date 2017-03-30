package com.app.models;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
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
    private byte[] name;
    @Column(name = "BOUNDS")
    private byte[] boundCoords;

    @ManyToOne()
    @JoinColumn(name = "OWNCITY_ID")
    private City ownCity;

    @OneToMany(mappedBy="ownSuburb")
    private List<Building> buildings;


    // JPA REQUIRES IT!
    public Suburb() {
    };

    public City getCity() {
        return ownCity;
    }

    public void setCity(City city) {
        this.ownCity = city;
        if (!city.getSuburbs().contains(this)) { // warning this may cause performance issues if you have a large data set since this operation is O(n)
            city.getSuburbs().add(this);
        }
    }

    public List<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<Building> buildings) {
        this.buildings = buildings;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getName() {
        return name;
    }

    public void setName(byte[] name) {
        this.name = name;
    }

    public byte[] getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
    }
}
