package com.app.repositories;

import com.app.models.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by Andrea on 12/03/2017.
 */
public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findCityById(Long id);

    Optional<City> findCityByName(String name);
}
