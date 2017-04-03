package com.app.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
    @Column(name = "ADDRESS_ID", insertable = false, updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;
    @Column(nullable = false)
    private Double longitude;

    @ManyToOne()
    @JoinColumn(name = "BUILDING_ID")
    private Building ownBuilding;

    @Column(name = "STREET_NAME")
    private String addressName;
    @Column(name = "HOUSE_NUMBER")
    private String houseNumber;
    @Column(name = "ROAD_NUMBER")
    private String roadNumber;

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

    public String getRoadNumber() {
        return roadNumber;
    }

    public void setRoadNumber(String roadNumber) {
        this.roadNumber = roadNumber;
    }
}
