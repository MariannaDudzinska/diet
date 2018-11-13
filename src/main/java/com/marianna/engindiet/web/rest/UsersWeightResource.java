package com.marianna.engindiet.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.marianna.engindiet.domain.UsersWeight;
import com.marianna.engindiet.repository.UsersWeightRepository;
import com.marianna.engindiet.web.rest.errors.BadRequestAlertException;
import com.marianna.engindiet.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing UsersWeight.
 */
@RestController
@RequestMapping("/api")
public class UsersWeightResource {

    private final Logger log = LoggerFactory.getLogger(UsersWeightResource.class);

    private static final String ENTITY_NAME = "usersWeight";

    private final UsersWeightRepository usersWeightRepository;

    public UsersWeightResource(UsersWeightRepository usersWeightRepository) {
        this.usersWeightRepository = usersWeightRepository;
    }

    /**
     * POST  /users-weights : Create a new usersWeight.
     *
     * @param usersWeight the usersWeight to create
     * @return the ResponseEntity with status 201 (Created) and with body the new usersWeight, or with status 400 (Bad Request) if the usersWeight has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/users-weights")
    @Timed
    public ResponseEntity<UsersWeight> createUsersWeight(@Valid @RequestBody UsersWeight usersWeight) throws URISyntaxException {
        log.debug("REST request to save UsersWeight : {}", usersWeight);
        if (usersWeight.getId() != null) {
            throw new BadRequestAlertException("A new usersWeight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UsersWeight result = usersWeightRepository.save(usersWeight);
        return ResponseEntity.created(new URI("/api/users-weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /users-weights : Updates an existing usersWeight.
     *
     * @param usersWeight the usersWeight to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated usersWeight,
     * or with status 400 (Bad Request) if the usersWeight is not valid,
     * or with status 500 (Internal Server Error) if the usersWeight couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/users-weights")
    @Timed
    public ResponseEntity<UsersWeight> updateUsersWeight(@Valid @RequestBody UsersWeight usersWeight) throws URISyntaxException {
        log.debug("REST request to update UsersWeight : {}", usersWeight);
        if (usersWeight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UsersWeight result = usersWeightRepository.save(usersWeight);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, usersWeight.getId().toString()))
            .body(result);
    }

    /**
     * GET  /users-weights : get all the usersWeights.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of usersWeights in body
     */
    @GetMapping("/users-weights")
    @Timed
    public List<UsersWeight> getAllUsersWeights() {
        log.debug("REST request to get all UsersWeights");
        return usersWeightRepository.findAll();
    }

    /**
     * GET  /users-weights/:id : get the "id" usersWeight.
     *
     * @param id the id of the usersWeight to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the usersWeight, or with status 404 (Not Found)
     */
    @GetMapping("/users-weights/{id}")
    @Timed
    public ResponseEntity<UsersWeight> getUsersWeight(@PathVariable Long id) {
        log.debug("REST request to get UsersWeight : {}", id);
        Optional<UsersWeight> usersWeight = usersWeightRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(usersWeight);
    }

    /**
     * DELETE  /users-weights/:id : delete the "id" usersWeight.
     *
     * @param id the id of the usersWeight to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/users-weights/{id}")
    @Timed
    public ResponseEntity<Void> deleteUsersWeight(@PathVariable Long id) {
        log.debug("REST request to delete UsersWeight : {}", id);

        usersWeightRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    /**
     * GET USER THATS LOGGED IN
     *
     */
    public String getCurrentUserLogin() {
        org.springframework.security.core.context.SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String login = null;
        if (authentication != null)
            if (authentication.getPrincipal() instanceof UserDetails)
                login = ((UserDetails) authentication.getPrincipal()).getUsername();
            else if (authentication.getPrincipal() instanceof String)
                login = (String) authentication.getPrincipal();

        return login;
    }
}
