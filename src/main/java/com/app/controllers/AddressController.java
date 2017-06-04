package com.app.controllers;

import com.app.models.Address;
import com.app.repositories.AddressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * Created by Andrea on 03/06/2017.
 */
@RestController
public class AddressController {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressController(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }


    public Collection<Address> getAddressByTypeId(long typeId) {
        return addressRepository.findAddressByTypes_Id(typeId);
    }
}
