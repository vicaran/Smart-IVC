package com.app.repositories;

import com.app.models.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by Andrea on 12/03/2017.
 */
public interface CityRepository extends JpaRepository<City, Long> {

    /**
     * Find city by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<City> findCityById(Long id);

    /**
     * Find city by name optional.
     *
     * @param name the name
     * @return the optional
     */
    Optional<City> findCityByName(String name);
}
