package com.marianna.engindiet.web.rest;

import com.marianna.engindiet.EnginDietApp;

import com.marianna.engindiet.domain.Nutrien;
import com.marianna.engindiet.repository.NutrienRepository;
import com.marianna.engindiet.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.marianna.engindiet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the NutrienResource REST controller.
 *
 * @see NutrienResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EnginDietApp.class)
public class NutrienResourceIntTest {

    private static final String DEFAULT_NUTRIENT = "AAAAAAAAAA";
    private static final String UPDATED_NUTRIENT = "BBBBBBBBBB";

    private static final String DEFAULT_UNIT = "AAAAAAAAAA";
    private static final String UPDATED_UNIT = "BBBBBBBBBB";

    private static final Double DEFAULT_VALUE = 1D;
    private static final Double UPDATED_VALUE = 2D;

    private static final Double DEFAULT_GM = 1D;
    private static final Double UPDATED_GM = 2D;

    @Autowired
    private NutrienRepository nutrienRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restNutrienMockMvc;

    private Nutrien nutrien;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NutrienResource nutrienResource = new NutrienResource(nutrienRepository);
        this.restNutrienMockMvc = MockMvcBuilders.standaloneSetup(nutrienResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Nutrien createEntity(EntityManager em) {
        Nutrien nutrien = new Nutrien()
            .nutrient(DEFAULT_NUTRIENT)
            .unit(DEFAULT_UNIT)
            .value(DEFAULT_VALUE)
            .gm(DEFAULT_GM);
        return nutrien;
    }

    @Before
    public void initTest() {
        nutrien = createEntity(em);
    }

    @Test
    @Transactional
    public void createNutrien() throws Exception {
        int databaseSizeBeforeCreate = nutrienRepository.findAll().size();

        // Create the Nutrien
        restNutrienMockMvc.perform(post("/api/nutriens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nutrien)))
            .andExpect(status().isCreated());

        // Validate the Nutrien in the database
        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeCreate + 1);
        Nutrien testNutrien = nutrienList.get(nutrienList.size() - 1);
        assertThat(testNutrien.getNutrient()).isEqualTo(DEFAULT_NUTRIENT);
        assertThat(testNutrien.getUnit()).isEqualTo(DEFAULT_UNIT);
        assertThat(testNutrien.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testNutrien.getGm()).isEqualTo(DEFAULT_GM);
    }

    @Test
    @Transactional
    public void createNutrienWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = nutrienRepository.findAll().size();

        // Create the Nutrien with an existing ID
        nutrien.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNutrienMockMvc.perform(post("/api/nutriens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nutrien)))
            .andExpect(status().isBadRequest());

        // Validate the Nutrien in the database
        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNutrientIsRequired() throws Exception {
        int databaseSizeBeforeTest = nutrienRepository.findAll().size();
        // set the field null
        nutrien.setNutrient(null);

        // Create the Nutrien, which fails.

        restNutrienMockMvc.perform(post("/api/nutriens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nutrien)))
            .andExpect(status().isBadRequest());

        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllNutriens() throws Exception {
        // Initialize the database
        nutrienRepository.saveAndFlush(nutrien);

        // Get all the nutrienList
        restNutrienMockMvc.perform(get("/api/nutriens?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nutrien.getId().intValue())))
            .andExpect(jsonPath("$.[*].nutrient").value(hasItem(DEFAULT_NUTRIENT.toString())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].gm").value(hasItem(DEFAULT_GM.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getNutrien() throws Exception {
        // Initialize the database
        nutrienRepository.saveAndFlush(nutrien);

        // Get the nutrien
        restNutrienMockMvc.perform(get("/api/nutriens/{id}", nutrien.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(nutrien.getId().intValue()))
            .andExpect(jsonPath("$.nutrient").value(DEFAULT_NUTRIENT.toString()))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.gm").value(DEFAULT_GM.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingNutrien() throws Exception {
        // Get the nutrien
        restNutrienMockMvc.perform(get("/api/nutriens/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNutrien() throws Exception {
        // Initialize the database
        nutrienRepository.saveAndFlush(nutrien);

        int databaseSizeBeforeUpdate = nutrienRepository.findAll().size();

        // Update the nutrien
        Nutrien updatedNutrien = nutrienRepository.findById(nutrien.getId()).get();
        // Disconnect from session so that the updates on updatedNutrien are not directly saved in db
        em.detach(updatedNutrien);
        updatedNutrien
            .nutrient(UPDATED_NUTRIENT)
            .unit(UPDATED_UNIT)
            .value(UPDATED_VALUE)
            .gm(UPDATED_GM);

        restNutrienMockMvc.perform(put("/api/nutriens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedNutrien)))
            .andExpect(status().isOk());

        // Validate the Nutrien in the database
        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeUpdate);
        Nutrien testNutrien = nutrienList.get(nutrienList.size() - 1);
        assertThat(testNutrien.getNutrient()).isEqualTo(UPDATED_NUTRIENT);
        assertThat(testNutrien.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testNutrien.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testNutrien.getGm()).isEqualTo(UPDATED_GM);
    }

    @Test
    @Transactional
    public void updateNonExistingNutrien() throws Exception {
        int databaseSizeBeforeUpdate = nutrienRepository.findAll().size();

        // Create the Nutrien

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNutrienMockMvc.perform(put("/api/nutriens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(nutrien)))
            .andExpect(status().isBadRequest());

        // Validate the Nutrien in the database
        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteNutrien() throws Exception {
        // Initialize the database
        nutrienRepository.saveAndFlush(nutrien);

        int databaseSizeBeforeDelete = nutrienRepository.findAll().size();

        // Get the nutrien
        restNutrienMockMvc.perform(delete("/api/nutriens/{id}", nutrien.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Nutrien> nutrienList = nutrienRepository.findAll();
        assertThat(nutrienList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Nutrien.class);
        Nutrien nutrien1 = new Nutrien();
        nutrien1.setId(1L);
        Nutrien nutrien2 = new Nutrien();
        nutrien2.setId(nutrien1.getId());
        assertThat(nutrien1).isEqualTo(nutrien2);
        nutrien2.setId(2L);
        assertThat(nutrien1).isNotEqualTo(nutrien2);
        nutrien1.setId(null);
        assertThat(nutrien1).isNotEqualTo(nutrien2);
    }
}
