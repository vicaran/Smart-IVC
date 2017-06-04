package com.app.repositories;

import com.app.models.Address;
import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * The interface Address repository.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Find address by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<Address> findAddressById(Long id);

    /**
     * Find address by latitude and longitude and own building id optional.
     *
     * @param latitude  the latitude
     * @param longitude the longitude
     * @param id        the id
     * @return the optional
     */
    Optional<Address> findAddressByLatitudeAndLongitudeAndOwnBuilding_Id(Double latitude, Double longitude, Long id);

    /**
     * Find address by road number list.
     *
     * @param roadNumber the road number
     * @return the list
     */
    List<Address> findAddressByRoadNumber(String roadNumber);

    /**
     * Find address by own building list.
     *
     * @param building the building
     * @return the list
     */
    List<Address> findAddressByOwnBuilding(Building building);

    /**
     * Find address by address name is null list.
     *
     * @return the list
     */
    List<Address> findAddressByAddressNameIsNull();

    /**
     * Find by types id list.
     *
     * @param id the id
     * @return the list
     */
    List<Address> findAddressByTypes_Id(Long id);
}
