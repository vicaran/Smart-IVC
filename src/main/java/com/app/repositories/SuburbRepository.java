package com.app.repositories;

import com.app.models.Building;
import com.app.models.Suburb;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by Andrea on 30/03/2017.
 */
public interface SuburbRepository  extends JpaRepository<Suburb, Long> {
    /**
     * Find suburb by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<Suburb> findSuburbById(Long id);

    /**
     * Find suburb by name optional.
     *
     * @param name the name
     * @return the optional
     */
    Optional<Suburb> findSuburbByName(String name);

//    Optional<Collection<Suburb>> findSuburbByCityId(Long id);


}
