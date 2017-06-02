package com.app.repositories;

import com.app.models.Building;

import java.util.List;
import java.util.Set;

/**
 * The interface Building repository custom.
 */
interface BuildingRepositoryCustom {
    /**
     * Find by filter text list.
     *
     * @param words the words
     * @return the list
     */
    List<Building> findByFilterText(Set<String> words);

    List<Object[]> findByDistance(Double latitude, Double longitude);
}
