package com.app.repositories;

import com.app.models.Type;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by Andrea on 16/04/2017.
 */
public interface TypeRepository extends JpaRepository<Type, Long> {
    /**
     * Find type by id optional.
     *
     * @param id the id
     * @return the optional
     */
    Optional<Type> findTypeById(Long id);

    /**
     * Find type by type name optional.
     *
     * @param typeName the type name
     * @return the optional
     */
    Optional<Type> findTypeByTypeName(String typeName);
}
