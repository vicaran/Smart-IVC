package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

/**
 * Created by Andrea on 30/03/2017.
 */
@Entity
@Table(name = "TYPE")
public class Type implements Serializable{
    @Id
    @Column(name = "TYPE_ID", insertable = false, updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="address_type",
            joinColumns = @JoinColumn(name = "id_address",
                    referencedColumnName = "TYPE_ID"),
            inverseJoinColumns = @JoinColumn(name = "id_type",
                    referencedColumnName = "ADDRESS_ID"))
    private Set<Address> addresses;

    @Column(name="name")
    private String typeName;

    /**
     * Instantiates a new Type.
     */
    public Type(){}

    /**
     * Instantiates a new Type.
     *
     * @param typeName the type name
     */
    public Type(String typeName){
        this.setTypeName(typeName);
        this.addresses = new HashSet<>();
    }

    public Type(Long typeId){
        this.setId(typeId);
        this.addresses = new HashSet<>();
    }

    /**
     * Gets type name.
     *
     * @return the type name
     */
    public String getTypeName() {
        return typeName;
    }

    /**
     * Sets type name.
     *
     * @param typeName the type name
     */
    public void setTypeName(String typeName) {
        this.typeName = typeName;
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
     * Gets addresses.
     *
     * @return the addresses
     */
    @JsonIgnore
    public Set<Address> getAddresses() {
        return addresses;
    }

    /**
     * Sets addresses.
     *
     * @param addresses the addresses
     */
    public void setAddresses(Set<Address> addresses) {
        this.addresses = addresses;
    }

    /**
     * Add address.
     *
     * @param address the address
     */
    public void addAddress(Address address) {
        this.addresses.add(address);
        if (!address.getTypes().contains(this)) {
            address.addType(this);
        }
    }

}
