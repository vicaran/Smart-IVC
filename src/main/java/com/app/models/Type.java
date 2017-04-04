package com.app.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
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

    @ManyToMany
    @JoinTable(name="address_type",
            joinColumns = @JoinColumn(name = "id_address",
                    referencedColumnName = "TYPE_ID"),
            inverseJoinColumns = @JoinColumn(name = "id_type",
                    referencedColumnName = "ADDRESS_ID"))
    private Set<Address> addresses;

    @Column(name="name")
    private String typeName;

    public Type(){}

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(Set<Address> addresses) {
        this.addresses = addresses;
    }

}
