package com.app.repositories;

import com.app.models.Building;

import java.util.List;
import java.util.Set;

/**
 * The interface Building repository custom.
 */
interface BuildingRepositoryCustom {

    int ALL_RESULTS = 0;

    /**
     * Find by filter text list.
     *
     * @param words the words
     * @return the list
     */
    List findByFilterText(Set<String> words, boolean justIds);

    List<Building> findBuildingCoordinatesByType(String type);

    List findByDistance(Double latitude, Double longitude, int maxDistance, int maxResults);
}
