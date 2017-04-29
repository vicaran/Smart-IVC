package com.app.repositories;

import com.app.models.Address;
import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Created by Andrea on 03/04/2017.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findAddressById(Long id);
    Optional<Address> findAddressByIdAndLatitudeAndLongitude(Long id, Double latitude, Double longitude);
    List<Address> findAddressByRoadNumber(String roadNumber);
    List<Address> findAddressByOwnBuilding(Building building);
    List<Address> findAddressByAddressNameIsNull();
}
