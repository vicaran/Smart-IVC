package com.app.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by Andrea on 30/03/2017.
 */
@Entity
@Table(name = "ADDRESS")
public class Address implements Serializable{

    @Id
    private Double latitude;
    @Id
    private Double longitude;

    @Id
    @ManyToOne()
    @JoinColumn(name = "BUILDING_ID")
    private Building ownBuilding;

    @Column(name = "STREET_NAME")
    private String addressName;
    @Column(name = "HOUSE_NUMBER")
    private String houseNumber;

    // JPA REQUIRES IT!
    public Address() {
    }


    public String getAddressName() {
        return addressName;
    }

    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Building getBuilding() {
        return ownBuilding;
    }

    public void setBuilding(Building ownBuilding) {
        this.ownBuilding = ownBuilding;
    }
}
