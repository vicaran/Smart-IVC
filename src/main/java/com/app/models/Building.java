package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Created by Andrea on 12/03/2017.
 */
@Entity
@Table(name = "BUILDING")
@Embeddable
public class Building implements Serializable {

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
    @Column(name = "RING_SWISS_COORDS")
    private byte[] ringSwissCoords;
    @Lob
    @Column(name = "RING_GLOBAL_COORDS")
    private byte[] ringGlobalCoords;
    @Column(name = "CENTROID_LAT")
    private Double centroidLat;
    @Column(name = "CENTROID_LNG")
    private Double centroidLng;
    @Column(name = "ALTITUDE")
    private Double altitude;

    @ManyToOne()
    @JoinColumn(name="OWNCITY_ID")
    private City ownCity;

    @ManyToOne()
    @JoinColumn(name="OWNSUBURB_ID")
    private Suburb ownSuburb;

    @OneToMany(mappedBy="ownBuilding", fetch=FetchType.EAGER)
    private List<Address> addresses;

    @ManyToMany
    @JoinTable(name = "building_type",
            joinColumns = @JoinColumn(name = "id_building",
                    referencedColumnName = "BUILDING_ID"),
            inverseJoinColumns = @JoinColumn(name = "id_type",
                    referencedColumnName = "TYPE_ID"))
    private Set<Type> types;

    // JPA REQUIRES IT!
    public Building() {
    }

    public Building(City city) {
        this.setCity(city);
        this.addresses = new ArrayList<>();
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

    public byte[] getBoundCoords() {
        return boundCoords;
    }

    public void setBoundCoords(byte[] boundCoords) {
        this.boundCoords = boundCoords;
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

    public byte[] getRingGlobalCoords() {
        return ringGlobalCoords;
    }

    public void setRingGlobalCoords(byte[] ringGlobalCoords) {
        this.ringGlobalCoords = ringGlobalCoords;
    }

    public byte[] getRingSwissCoords() {
        return ringSwissCoords;
    }

    public void setRingSwissCoords(byte[] ringSwissCoords) {
        this.ringSwissCoords = ringSwissCoords;
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

    public Suburb getSuburb() {
        return ownSuburb;
    }

    public void setSuburb(Suburb suburb) {
        this.ownSuburb = suburb;
        if (!suburb.getBuildings().contains(this)) { // warning this may cause performance issues if you have a large data set since this operation is O(n)
            suburb.getBuildings().add(this);
        }
    }

    @JsonIgnore
    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public void addAddress(Address address){
        this.addresses.add(address);
        if (address.getBuilding() != this) {
            address.setBuilding(this);
        }
    }

    public Double getAltitude() {
        return altitude;
    }

    public void setAltitude(Double altitude) {
        this.altitude = altitude;
    }


    public Set<Type> getTypes() {
        return types;
    }

    public void setTypes(Set<Type> types) {
        this.types = types;
    }

    public void addType(Type type){
        this.types.add(type);
    }
}
