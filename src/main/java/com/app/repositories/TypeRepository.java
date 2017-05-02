package com.app.repositories;

import com.app.models.Type;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by Andrea on 16/04/2017.
 */
public interface TypeRepository extends JpaRepository<Type, Long> {
    Optional<Type> findTypeById(Long id);
    Optional<Type> findTypeByTypeName(String typeName);
}
