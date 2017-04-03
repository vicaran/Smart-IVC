package com.app.repositories;

import com.app.models.Address;
import com.app.models.Building;
import com.app.models.id_classes.AddressId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by Andrea on 03/04/2017.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findAddressById(Long id);

}
