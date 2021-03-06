package com.app.repositories;

import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * The interface Building repository.
 */
public interface BuildingRepository extends JpaRepository<Building, Long>, BuildingRepositoryCustom {

    /**
     * Find building by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<Building> findBuildingById(Long id);

    /**
     * Find buildings by own city country list.
     *
     * @param country the country
     * @return the list
     */
    List<Building> findBuildingsByOwnCityCountry(String country);

    /**
     * Find building by own city id list.
     *
     * @param id the id
     * @return the list
     */
    List<Building> findBuildingByOwnCityId(Long id);

    /**
     * Find buildings by centroid lat less than and centroid lng greater than and centroid lat greater than and centroid lng less than list.
     *
     * @param maxLat the max lat
     * @param maxLng the max lng
     * @param minLat the min lat
     * @param minLng the min lng
     * @return the list
     */
    List<Building> findBuildingsByCentroidLatLessThanAndCentroidLngGreaterThanAndCentroidLatGreaterThanAndCentroidLngLessThan(Double maxLat, Double maxLng, Double minLat, Double minLng);

    /**
     * Find buildings by egid uca is not null list.
     *
     * @return the list
     */
    List<Building> findBuildingsByEgidUcaIsNotNull();

    /**
     * Find buildings by floors less than list.
     *
     * @param floors the floors
     * @return the list
     */
    List<Building> findBuildingsByFloorsLessThan(int floors);

    /**
     * Find buildings by floors equals list.
     *
     * @param floors the floors
     * @return the list
     */
    List<Building> findBuildingsByFloorsEquals(int floors);

    /**
     * Find buildings by floors greater than list.
     *
     * @param floors the floors
     * @return the list
     */
    List<Building> findBuildingsByFloorsGreaterThan(int floors);

    /**
     * Find buildings by egid uca optional.
     *
     * @param egidUca the egid uca
     * @return the optional
     */
    Optional<List<Building>> findBuildingsByEgidUca(Long egidUca);

    /**
     * Find building by id less than list.
     *
     * @param idx the idx
     * @return the list
     */
    List<Building> findBuildingByIdLessThan(Long idx);
}
