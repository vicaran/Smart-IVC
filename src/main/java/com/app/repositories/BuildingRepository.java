package com.app.repositories;

import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Created by Andrea on 13/03/2017.
 */
public interface BuildingRepository extends JpaRepository<Building, Long> {

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
}
