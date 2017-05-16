package com.app.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BUILDING_ID")
    private Building ownBuilding;

    @Column(name = "STREET_NAME")
    private String addressName;
    @Column(name = "HOUSE_NUMBER")
    private String houseNumber;
    @Column(name = "ROAD_NUMBER")
    private String roadNumber;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinTable(name = "address_type",
            joinColumns = @JoinColumn(name = "id_address",
                    referencedColumnName = "ADDRESS_ID"),
            inverseJoinColumns = @JoinColumn(name = "id_type",
                    referencedColumnName = "TYPE_ID"))
    private Set<Type> types;

    /**
     * Instantiates a new Address.
     */
// JPA REQUIRES IT!
    public Address() {
    }


    /**
     * Gets address name.
     *
     * @return the address name
     */
    public String getAddressName() {
        return addressName;
    }

    /**
     * Sets address name.
     *
     * @param addressName the address name
     */
    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }

    /**
     * Gets house number.
     *
     * @return the house number
     */
    public String getHouseNumber() {
        return houseNumber;
    }

    /**
     * Sets house number.
     *
     * @param houseNumber the house number
     */
    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    /**
     * Gets latitude.
     *
     * @return the latitude
     */
    public Double getLatitude() {
        return latitude;
    }

    /**
     * Sets latitude.
     *
     * @param latitude the latitude
     */
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    /**
     * Gets longitude.
     *
     * @return the longitude
     */
    public Double getLongitude() {
        return longitude;
    }

    /**
     * Sets longitude.
     *
     * @param longitude the longitude
     */
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    /**
     * Gets building.
     *
     * @return the building
     */
    public Building getBuilding() {
        return ownBuilding;
    }

    /**
     * Sets building.
     *
     * @param ownBuilding the own building
     */
    public void setBuilding(Building ownBuilding) {
        this.ownBuilding = ownBuilding;
    }

    /**
     * Gets road number.
     *
     * @return the road number
     */
    public String getRoadNumber() {
        return roadNumber;
    }

    /**
     * Sets road number.
     *
     * @param roadNumber the road number
     */
    public void setRoadNumber(String roadNumber) {
        this.roadNumber = roadNumber;
    }

    /**
     * Gets types.
     *
     * @return the types
     */
    public Set<Type> getTypes() {
        return types;
    }

    /**
     * Sets types.
     *
     * @param types the types
     */
    public void setTypes(Set<Type> types) {
        this.types = types;
    }

    /**
     * Add type.
     *
     * @param type the type
     */
    public void addType(Type type){
        this.types.add(type);
    }
}
