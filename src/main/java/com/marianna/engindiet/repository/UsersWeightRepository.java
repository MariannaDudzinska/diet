package com.marianna.engindiet.repository;

import com.marianna.engindiet.domain.User;
import com.marianna.engindiet.domain.UsersWeight;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UsersWeight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsersWeightRepository extends JpaRepository<UsersWeight, Long> {

}
