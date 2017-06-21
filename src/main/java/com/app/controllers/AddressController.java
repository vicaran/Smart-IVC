package com.app.controllers;

import com.app.models.Address;
import com.app.repositories.AddressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * The type Address controller.
 */
@RestController
public class AddressController {

    private final AddressRepository addressRepository;

    /**
     * Instantiates a new Address controller.
     *
     * @param addressRepository the address repository
     */
    @Autowired
    public AddressController(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }


    /**
     * Gets address by type id.
     *
     * @param typeId the type id
     * @return the address by type id
     */
    public Collection<Address> getAddressByTypeId(long typeId) {
        return addressRepository.findAddressByTypes_Id(typeId);
    }
}
