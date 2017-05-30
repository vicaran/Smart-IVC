package com.app.models;

import com.google.maps.model.Geometry;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.Formula;

import java.awt.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
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
    @Column(name = "EGID_UCA")
    private Long egidUca;
    @Column(name = "EDID_UCA")
    private Long edidUca;
    @Column(name = "SECTION")
    private Long section;
    @Column(name = "PRIMARY_HOUSES")
    private String primaryHouses;
    @Column(name = "SECONDARY_HOUSES")
    private String secondaryHouses;

    @ManyToOne()
    @JoinColumn(name="OWNCITY_ID")
    private City ownCity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="OWNSUBURB_ID")
    private Suburb ownSuburb;

    @OneToMany(mappedBy = "ownBuilding", cascade = CascadeType.ALL)
    private List<Address> addresses;

    @Formula("(PRIMARY_HOUSES/(PRIMARY_HOUSES+SECONDARY_HOUSES))*100")
    private Long primaryHousesPercentage;

    @Formula("(SECONDARY_HOUSES/(PRIMARY_HOUSES+SECONDARY_HOUSES))*100")
    private Long secondaryHousesPercentage;

//    @Formula("")
//    private Point buildingCoordinate;

    /**
     * Instantiates a new Building.
     */
// JPA REQUIRES IT!
    public Building() {
    }

    /**
     * Instantiates a new Building.
     *
     * @param city the city
     */
    public Building(City city) {
        this.setCity(city);
        this.addresses = new ArrayList<>();
    }

    /**
     * Gets description.
     *
     * @return the description
     */
    @JsonIgnore
    public String getDescription() {
        return description;
    }

    /**
     * Sets description.
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets floors.
     *
     * @return the floors
     */
    public int getFloors() {
        return floors;
    }

    /**
     * Sets floors.
     *
     * @param floors the floors
     */
    public void setFloors(int floors) {
        this.floors = floors;
    }

    /**
     * Gets shape length.
     *
     * @return the shape length
     */
    public double getShapeLength() {
        return shapeLength;
    }

    /**
     * Sets shape length.
     *
     * @param shapeLength the shape length
     */
    public void setShapeLength(double shapeLength) {
        this.shapeLength = shapeLength;
    }

    /**
     * Gets shape area.
     *
     * @return the shape area
     */
    @JsonIgnore
    public double getShapeArea() {
        return shapeArea;
    }

    /**
     * Sets shape area.
     *
     * @param shapeArea the shape area
     */
    public void setShapeArea(double shapeArea) {
        this.shapeArea = shapeArea;
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
     * Gets centroid lat.
     *
     * @return the centroid lat
     */
    public Double getCentroidLat() {
        return centroidLat;
    }

    /**
     * Sets centroid lat.
     *
     * @param centroidLat the centroid lat
     */
    public void setCentroidLat(Double centroidLat) {
        this.centroidLat = centroidLat;
    }

    /**
     * Gets centroid lng.
     *
     * @return the centroid lng
     */
    public Double getCentroidLng() {
        return centroidLng;
    }

    /**
     * Sets centroid lng.
     *
     * @param centroidLng the centroid lng
     */
    public void setCentroidLng(Double centroidLng) {
        this.centroidLng = centroidLng;
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
     * Get ring global coords byte [ ].
     *
     * @return the byte [ ]
     */
    public byte[] getRingGlobalCoords() {
        return ringGlobalCoords;
    }

    /**
     * Sets ring global coords.
     *
     * @param ringGlobalCoords the ring global coords
     */
    public void setRingGlobalCoords(byte[] ringGlobalCoords) {
        this.ringGlobalCoords = ringGlobalCoords;
    }

    /**
     * Get ring swiss coords byte [ ].
     *
     * @return the byte [ ]
     */
    @JsonIgnore
    public byte[] getRingSwissCoords() {
        return ringSwissCoords;
    }

    /**
     * Sets ring swiss coords.
     *
     * @param ringSwissCoords the ring swiss coords
     */
    public void setRingSwissCoords(byte[] ringSwissCoords) {
        this.ringSwissCoords = ringSwissCoords;
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
        if (!city.getBuildings().contains(this)) { // warning this may cause performance issues if you have a large data set since this operation is O(n)
            city.getBuildings().add(this);
        }
    }

    /**
     * Gets suburb.
     *
     * @return the suburb
     */
    @JsonIgnore
    public Suburb getSuburb() {
        return ownSuburb;
    }

    /**
     * Sets suburb.
     *
     * @param suburb the suburb
     */
    public void setSuburb(Suburb suburb) {
        if (sameAsFormer(suburb))
            return;
        this.ownSuburb = suburb;
    }

    private boolean sameAsFormer(Suburb suburb) {
        return ownSuburb == null ? suburb == null : ownSuburb.equals(suburb);
    }

    /**
     * Gets addresses.
     *
     * @return the addresses
     */
    @JsonIgnore
    public List<Address> getAddresses() {
        return addresses;
    }

    /**
     * Sets addresses.
     *
     * @param addresses the addresses
     */
    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    /**
     * Add address.
     *
     * @param address the address
     */
    public void addAddress(Address address){
        this.addresses.add(address);
        if (address.getBuilding() != this) {
            address.setBuilding(this);
        }
    }

    /**
     * Gets egid uca.
     *
     * @return the egid uca
     */
    public Long getEgidUca() {
        return egidUca;
    }

    /**
     * Sets egid uca.
     *
     * @param egidUca the egid uca
     */
    public void setEgidUca(Long egidUca) {
        this.egidUca = egidUca;
    }

    /**
     * Gets edid uca.
     *
     * @return the edid uca
     */
    @JsonIgnore
    public Long getEdidUca() {
        return edidUca;
    }

    /**
     * Sets edid uca.
     *
     * @param edidUca the edid uca
     */
    public void setEdidUca(Long edidUca) {
        this.edidUca = edidUca;
    }

    /**
     * Gets section.
     *
     * @return the section
     */
    @JsonIgnore
    public Long getSection() {
        return section;
    }

    /**
     * Sets section.
     *
     * @param section the section
     */
    public void setSection(Long section) {
        this.section = section;
    }

    /**
     * Gets primary houses.
     *
     * @return the primary houses
     */
    public String getPrimaryHouses() {
        return primaryHouses;
    }

    /**
     * Sets primary houses.
     *
     * @param primaryHouses the primary houses
     */
    public void setPrimaryHouses(String primaryHouses) {
        this.primaryHouses = primaryHouses;
    }

    /**
     * Gets secondary houses.
     *
     * @return the secondary houses
     */
    public String getSecondaryHouses() {
        return secondaryHouses;
    }

    /**
     * Sets secondary houses.
     *
     * @param secondaryHouses the secondary houses
     */
    public void setSecondaryHouses(String secondaryHouses) {
        this.secondaryHouses = secondaryHouses;
    }

    @JsonIgnore
    public Long getPrimaryHousesPercentage() {
        return primaryHousesPercentage;
    }

    public void setPrimaryHousesPercentage(Long primaryHousesPercentage) {
        this.primaryHousesPercentage = primaryHousesPercentage;
    }

    @JsonIgnore
    public Long getSecondaryHousesPercentage() {
        return secondaryHousesPercentage;
    }

    public void setSecondaryHousesPercentage(Long secondaryHousesPercentage) {
        this.secondaryHousesPercentage = secondaryHousesPercentage;
    }

}
