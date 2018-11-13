package com.marianna.engindiet.web.rest;

import com.marianna.engindiet.EnginDietApp;

import com.marianna.engindiet.domain.UsersWeight;
import com.marianna.engindiet.domain.UserExtra;
import com.marianna.engindiet.repository.UsersWeightRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.marianna.engindiet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UsersWeightResource REST controller.
 *
 * @see UsersWeightResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EnginDietApp.class)
public class UsersWeightResourceIntTest {

    private static final LocalDate DEFAULT_DATE_OF_LOG = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_LOG = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_VALUE_IN_KG = 30;
    private static final Integer UPDATED_VALUE_IN_KG = 31;

    @Autowired
    private UsersWeightRepository usersWeightRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUsersWeightMockMvc;

    private UsersWeight usersWeight;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UsersWeightResource usersWeightResource = new UsersWeightResource(usersWeightRepository);
        this.restUsersWeightMockMvc = MockMvcBuilders.standaloneSetup(usersWeightResource)
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
    public static UsersWeight createEntity(EntityManager em) {
        UsersWeight usersWeight = new UsersWeight()
            .dateOfLog(DEFAULT_DATE_OF_LOG)
            .valueInKg(DEFAULT_VALUE_IN_KG);
        // Add required entity
        UserExtra userExtra = UserExtraResourceIntTest.createEntity(em);
        em.persist(userExtra);
        em.flush();
        usersWeight.setUserExtra(userExtra);
        return usersWeight;
    }

    @Before
    public void initTest() {
        usersWeight = createEntity(em);
    }

    @Test
    @Transactional
    public void createUsersWeight() throws Exception {
        int databaseSizeBeforeCreate = usersWeightRepository.findAll().size();

        // Create the UsersWeight
        restUsersWeightMockMvc.perform(post("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(usersWeight)))
            .andExpect(status().isCreated());

        // Validate the UsersWeight in the database
        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeCreate + 1);
        UsersWeight testUsersWeight = usersWeightList.get(usersWeightList.size() - 1);
        assertThat(testUsersWeight.getDateOfLog()).isEqualTo(DEFAULT_DATE_OF_LOG);
        assertThat(testUsersWeight.getValueInKg()).isEqualTo(DEFAULT_VALUE_IN_KG);
    }

    @Test
    @Transactional
    public void createUsersWeightWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = usersWeightRepository.findAll().size();

        // Create the UsersWeight with an existing ID
        usersWeight.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsersWeightMockMvc.perform(post("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(usersWeight)))
            .andExpect(status().isBadRequest());

        // Validate the UsersWeight in the database
        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDateOfLogIsRequired() throws Exception {
        int databaseSizeBeforeTest = usersWeightRepository.findAll().size();
        // set the field null
        usersWeight.setDateOfLog(null);

        // Create the UsersWeight, which fails.

        restUsersWeightMockMvc.perform(post("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(usersWeight)))
            .andExpect(status().isBadRequest());

        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValueInKgIsRequired() throws Exception {
        int databaseSizeBeforeTest = usersWeightRepository.findAll().size();
        // set the field null
        usersWeight.setValueInKg(null);

        // Create the UsersWeight, which fails.

        restUsersWeightMockMvc.perform(post("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(usersWeight)))
            .andExpect(status().isBadRequest());

        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUsersWeights() throws Exception {
        // Initialize the database
        usersWeightRepository.saveAndFlush(usersWeight);

        // Get all the usersWeightList
        restUsersWeightMockMvc.perform(get("/api/users-weights?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(usersWeight.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateOfLog").value(hasItem(DEFAULT_DATE_OF_LOG.toString())))
            .andExpect(jsonPath("$.[*].valueInKg").value(hasItem(DEFAULT_VALUE_IN_KG)));
    }
    
    @Test
    @Transactional
    public void getUsersWeight() throws Exception {
        // Initialize the database
        usersWeightRepository.saveAndFlush(usersWeight);

        // Get the usersWeight
        restUsersWeightMockMvc.perform(get("/api/users-weights/{id}", usersWeight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(usersWeight.getId().intValue()))
            .andExpect(jsonPath("$.dateOfLog").value(DEFAULT_DATE_OF_LOG.toString()))
            .andExpect(jsonPath("$.valueInKg").value(DEFAULT_VALUE_IN_KG));
    }

    @Test
    @Transactional
    public void getNonExistingUsersWeight() throws Exception {
        // Get the usersWeight
        restUsersWeightMockMvc.perform(get("/api/users-weights/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUsersWeight() throws Exception {
        // Initialize the database
        usersWeightRepository.saveAndFlush(usersWeight);

        int databaseSizeBeforeUpdate = usersWeightRepository.findAll().size();

        // Update the usersWeight
        UsersWeight updatedUsersWeight = usersWeightRepository.findById(usersWeight.getId()).get();
        // Disconnect from session so that the updates on updatedUsersWeight are not directly saved in db
        em.detach(updatedUsersWeight);
        updatedUsersWeight
            .dateOfLog(UPDATED_DATE_OF_LOG)
            .valueInKg(UPDATED_VALUE_IN_KG);

        restUsersWeightMockMvc.perform(put("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUsersWeight)))
            .andExpect(status().isOk());

        // Validate the UsersWeight in the database
        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeUpdate);
        UsersWeight testUsersWeight = usersWeightList.get(usersWeightList.size() - 1);
        assertThat(testUsersWeight.getDateOfLog()).isEqualTo(UPDATED_DATE_OF_LOG);
        assertThat(testUsersWeight.getValueInKg()).isEqualTo(UPDATED_VALUE_IN_KG);
    }

    @Test
    @Transactional
    public void updateNonExistingUsersWeight() throws Exception {
        int databaseSizeBeforeUpdate = usersWeightRepository.findAll().size();

        // Create the UsersWeight

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsersWeightMockMvc.perform(put("/api/users-weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(usersWeight)))
            .andExpect(status().isBadRequest());

        // Validate the UsersWeight in the database
        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUsersWeight() throws Exception {
        // Initialize the database
        usersWeightRepository.saveAndFlush(usersWeight);

        int databaseSizeBeforeDelete = usersWeightRepository.findAll().size();

        // Get the usersWeight
        restUsersWeightMockMvc.perform(delete("/api/users-weights/{id}", usersWeight.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UsersWeight> usersWeightList = usersWeightRepository.findAll();
        assertThat(usersWeightList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UsersWeight.class);
        UsersWeight usersWeight1 = new UsersWeight();
        usersWeight1.setId(1L);
        UsersWeight usersWeight2 = new UsersWeight();
        usersWeight2.setId(usersWeight1.getId());
        assertThat(usersWeight1).isEqualTo(usersWeight2);
        usersWeight2.setId(2L);
        assertThat(usersWeight1).isNotEqualTo(usersWeight2);
        usersWeight1.setId(null);
        assertThat(usersWeight1).isNotEqualTo(usersWeight2);
    }
}
