package com.app.repositories;

import com.app.models.Building;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by Andrea on 13/03/2017.
 */
public interface BuildingRepository extends JpaRepository<Building, Long> {

        Optional<Building> findBuildingById(Long id);

}
