package com.app.repositories;

import com.app.models.Address;
import com.app.models.Building;
import com.app.models.Suburb;
import com.app.models.Type;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

/**
 * Created by Andrea on 23/05/2017.
 */
@Repository
public class BuildingRepositoryImpl implements BuildingRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Building> findByFilterText(Set<String> words) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Building> query = criteriaBuilder.createQuery(Building.class);
        Root<Building> buildingRoot = query.from(Building.class);

        List<Predicate> predicates = new ArrayList<>();
        for (String word : words) {
            Predicate predicateResult = this.createPredicates(criteriaBuilder, query, buildingRoot, word);
            if (predicateResult != null) {
                predicates.add(predicateResult);
            }
        }

        query.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])));
        return entityManager.createQuery(query.select(buildingRoot.get("id"))).getResultList();
    }

    private Predicate createPredicates(CriteriaBuilder criteriaBuilder, CriteriaQuery<Building> query, Root<Building> buildingRoot, String word) {
        String[] queryVal = word.split("=");
        Predicate predicateResult = null;
        switch (queryVal[0]) {
            case "floors":
                Path<String> buildingFloors = buildingRoot.get("floors");
                String[] compareArr = queryVal[1].split("_");
                switch (compareArr[0]) {
                    case "less":
                        predicateResult = criteriaBuilder.lessThan(buildingFloors, compareArr[1]);
                        break;
                    case "greater":
                        predicateResult = criteriaBuilder.greaterThan(buildingFloors, compareArr[1]);
                        break;
                    case "equal":
                        predicateResult = criteriaBuilder.equal(buildingFloors, compareArr[1]);
                        break;
                    default:
                        break;
                }
                break;
            case "type":
                Join<Building, Address> buildingAddressJoin = buildingRoot.join("addresses");
                Join<Address, Type> addressTypeJoin = buildingAddressJoin.join("types");
                predicateResult = criteriaBuilder.equal(addressTypeJoin.get("id"), queryVal[1]);
                break;
            case "primarySecondaryPercentage":
                String[] typeArr = queryVal[1].split("_");
                switch (typeArr[0]) {
                    case "primary":
                        predicateResult = criteriaBuilder.greaterThanOrEqualTo(buildingRoot.get("primaryHousesPercentage"), typeArr[1]);
                        break;
                    case "secondary":
                        predicateResult = criteriaBuilder.greaterThanOrEqualTo(buildingRoot.get("secondaryHousesPercentage"), typeArr[1]);
                        break;
                    default:
                        break;
                }
                break;
            case "suburb":
                Join<Building,Suburb> buildingSuburbJoin = buildingRoot.join( "ownSuburb" );
                Path<String> buildingSuburb = buildingSuburbJoin.get("id");
                predicateResult = criteriaBuilder.equal(buildingSuburb, queryVal[1]);
            default:
                break;
        }
        return predicateResult;
    }
}
