package com.marianna.engindiet.repository;

import com.marianna.engindiet.domain.Nutrien;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Nutrien entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NutrienRepository extends JpaRepository<Nutrien, Long> {

}
