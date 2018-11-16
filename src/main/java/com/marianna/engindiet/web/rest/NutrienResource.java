package com.marianna.engindiet.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.marianna.engindiet.domain.Nutrien;
import com.marianna.engindiet.repository.NutrienRepository;
import com.marianna.engindiet.web.rest.errors.BadRequestAlertException;
import com.marianna.engindiet.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Nutrien.
 */
@RestController
@RequestMapping("/api")
public class NutrienResource {

    private final Logger log = LoggerFactory.getLogger(NutrienResource.class);

    private static final String ENTITY_NAME = "nutrien";

    private final NutrienRepository nutrienRepository;

    public NutrienResource(NutrienRepository nutrienRepository) {
        this.nutrienRepository = nutrienRepository;
    }

    /**
     * POST  /nutriens : Create a new nutrien.
     *
     * @param nutrien the nutrien to create
     * @return the ResponseEntity with status 201 (Created) and with body the new nutrien, or with status 400 (Bad Request) if the nutrien has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/nutriens")
    @Timed
    public ResponseEntity<Nutrien> createNutrien(@Valid @RequestBody Nutrien nutrien) throws URISyntaxException {
        log.debug("REST request to save Nutrien : {}", nutrien);
        if (nutrien.getId() != null) {
            throw new BadRequestAlertException("A new nutrien cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Nutrien result = nutrienRepository.save(nutrien);
        return ResponseEntity.created(new URI("/api/nutriens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /nutriens : Updates an existing nutrien.
     *
     * @param nutrien the nutrien to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated nutrien,
     * or with status 400 (Bad Request) if the nutrien is not valid,
     * or with status 500 (Internal Server Error) if the nutrien couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/nutriens")
    @Timed
    public ResponseEntity<Nutrien> updateNutrien(@Valid @RequestBody Nutrien nutrien) throws URISyntaxException {
        log.debug("REST request to update Nutrien : {}", nutrien);
        if (nutrien.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Nutrien result = nutrienRepository.save(nutrien);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, nutrien.getId().toString()))
            .body(result);
    }

    /**
     * GET  /nutriens : get all the nutriens.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of nutriens in body
     */
    @GetMapping("/nutriens")
    @Timed
    public List<Nutrien> getAllNutriens() {
        log.debug("REST request to get all Nutriens");
        return nutrienRepository.findAll();
    }

    /**
     * GET  /nutriens/:id : get the "id" nutrien.
     *
     * @param id the id of the nutrien to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the nutrien, or with status 404 (Not Found)
     */
    @GetMapping("/nutriens/{id}")
    @Timed
    public ResponseEntity<Nutrien> getNutrien(@PathVariable Long id) {
        log.debug("REST request to get Nutrien : {}", id);
        Optional<Nutrien> nutrien = nutrienRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nutrien);
    }

    /**
     * DELETE  /nutriens/:id : delete the "id" nutrien.
     *
     * @param id the id of the nutrien to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/nutriens/{id}")
    @Timed
    public ResponseEntity<Void> deleteNutrien(@PathVariable Long id) {
        log.debug("REST request to delete Nutrien : {}", id);

        nutrienRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
