package com.app.repositories;

import com.app.models.Building;

import java.util.List;
import java.util.Set;

/**
 * The interface Building repository custom.
 */
interface BuildingRepositoryCustom {

    /**
     * The constant ALL_RESULTS.
     */
    int ALL_RESULTS = 0;

    /**
     * Find by filter text list.
     *
     * @param words   the words
     * @param justIds the just ids
     * @return the list
     */
    List findByFilterText(Set<String> words, boolean justIds);

    /**
     * Find building coordinates by type list.
     *
     * @param type the type
     * @return the list
     */
    List<Building> findBuildingCoordinatesByType(String type);

    /**
     * Find by distance list.
     *
     * @param latitude    the latitude
     * @param longitude   the longitude
     * @param maxDistance the max distance
     * @param maxResults  the max results
     * @return the list
     */
    List findByDistance(Double latitude, Double longitude, int maxDistance, int maxResults);
}
