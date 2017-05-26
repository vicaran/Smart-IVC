package com.app.repositories;

import com.app.models.Building;

import java.util.List;
import java.util.Set;

/**
 * Created by Andrea on 23/05/2017.
 */
interface BuildingRepositoryCustom {
    List<Building> findByFilterText(Set<String> words);
}
