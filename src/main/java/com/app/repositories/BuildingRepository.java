package com.app.repositories;

import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Created by Andrea on 13/03/2017.
 */
public interface BuildingRepository extends JpaRepository<Building, Long> {

        Optional<Building> findBuildingById(Long id);

        @Query("SELECT b FROM Building b WHERE centroid_lat < ?1 AND centroid_lng > ?2 AND centroid_lat > ?3 AND centroid_lng < ?4")
        List<Building> findBuildingFromRange(Double maxLat, Double maxLng, Double minLat, Double minLng);

}
