package com.marianna.engindiet.web.rest;

import com.marianna.engindiet.EnginDietApp;

import com.marianna.engindiet.domain.UserExtra;
import com.marianna.engindiet.repository.UserExtraRepository;
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

import com.marianna.engindiet.domain.enumeration.STYLE;
import com.marianna.engindiet.domain.enumeration.DIETMODE;
/**
 * Test class for the UserExtraResource REST controller.
 *
 * @see UserExtraResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EnginDietApp.class)
public class UserExtraResourceIntTest {

    private static final Integer DEFAULT_WEIGHT = 1;
    private static final Integer UPDATED_WEIGHT = 2;

    private static final Integer DEFAULT_HEIGHT = 1;
    private static final Integer UPDATED_HEIGHT = 2;

    private static final STYLE DEFAULT_LIFESTYLE = STYLE.SITTING;
    private static final STYLE UPDATED_LIFESTYLE = STYLE.AVERAGE;

    private static final DIETMODE DEFAULT_DIET_MODE = DIETMODE.BALANCED;
    private static final DIETMODE UPDATED_DIET_MODE = DIETMODE.LOSE;

    @Autowired
    private UserExtraRepository userExtraRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUserExtraMockMvc;

    private UserExtra userExtra;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserExtraResource userExtraResource = new UserExtraResource(userExtraRepository);
        this.restUserExtraMockMvc = MockMvcBuilders.standaloneSetup(userExtraResource)
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
    public static UserExtra createEntity(EntityManager em) {
        UserExtra userExtra = new UserExtra()
            .weight(DEFAULT_WEIGHT)
            .height(DEFAULT_HEIGHT)
            .lifestyle(DEFAULT_LIFESTYLE)
            .dietMode(DEFAULT_DIET_MODE);
        return userExtra;
    }

    @Before
    public void initTest() {
        userExtra = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserExtra() throws Exception {
        int databaseSizeBeforeCreate = userExtraRepository.findAll().size();

        // Create the UserExtra
        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isCreated());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeCreate + 1);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testUserExtra.getHeight()).isEqualTo(DEFAULT_HEIGHT);
        assertThat(testUserExtra.getLifestyle()).isEqualTo(DEFAULT_LIFESTYLE);
        assertThat(testUserExtra.getDietMode()).isEqualTo(DEFAULT_DIET_MODE);
    }

    @Test
    @Transactional
    public void createUserExtraWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userExtraRepository.findAll().size();

        // Create the UserExtra with an existing ID
        userExtra.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = userExtraRepository.findAll().size();
        // set the field null
        userExtra.setWeight(null);

        // Create the UserExtra, which fails.

        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = userExtraRepository.findAll().size();
        // set the field null
        userExtra.setHeight(null);

        // Create the UserExtra, which fails.

        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLifestyleIsRequired() throws Exception {
        int databaseSizeBeforeTest = userExtraRepository.findAll().size();
        // set the field null
        userExtra.setLifestyle(null);

        // Create the UserExtra, which fails.

        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDietModeIsRequired() throws Exception {
        int databaseSizeBeforeTest = userExtraRepository.findAll().size();
        // set the field null
        userExtra.setDietMode(null);

        // Create the UserExtra, which fails.

        restUserExtraMockMvc.perform(post("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUserExtras() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        // Get all the userExtraList
        restUserExtraMockMvc.perform(get("/api/user-extras?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userExtra.getId().intValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT)))
            .andExpect(jsonPath("$.[*].height").value(hasItem(DEFAULT_HEIGHT)))
            .andExpect(jsonPath("$.[*].lifestyle").value(hasItem(DEFAULT_LIFESTYLE.toString())))
            .andExpect(jsonPath("$.[*].dietMode").value(hasItem(DEFAULT_DIET_MODE.toString())));
    }
    
    @Test
    @Transactional
    public void getUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        // Get the userExtra
        restUserExtraMockMvc.perform(get("/api/user-extras/{id}", userExtra.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userExtra.getId().intValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT))
            .andExpect(jsonPath("$.height").value(DEFAULT_HEIGHT))
            .andExpect(jsonPath("$.lifestyle").value(DEFAULT_LIFESTYLE.toString()))
            .andExpect(jsonPath("$.dietMode").value(DEFAULT_DIET_MODE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUserExtra() throws Exception {
        // Get the userExtra
        restUserExtraMockMvc.perform(get("/api/user-extras/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Update the userExtra
        UserExtra updatedUserExtra = userExtraRepository.findById(userExtra.getId()).get();
        // Disconnect from session so that the updates on updatedUserExtra are not directly saved in db
        em.detach(updatedUserExtra);
        updatedUserExtra
            .weight(UPDATED_WEIGHT)
            .height(UPDATED_HEIGHT)
            .lifestyle(UPDATED_LIFESTYLE)
            .dietMode(UPDATED_DIET_MODE);

        restUserExtraMockMvc.perform(put("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserExtra)))
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserExtra.getHeight()).isEqualTo(UPDATED_HEIGHT);
        assertThat(testUserExtra.getLifestyle()).isEqualTo(UPDATED_LIFESTYLE);
        assertThat(testUserExtra.getDietMode()).isEqualTo(UPDATED_DIET_MODE);
    }

    @Test
    @Transactional
    public void updateNonExistingUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Create the UserExtra

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtraMockMvc.perform(put("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeDelete = userExtraRepository.findAll().size();

        // Get the userExtra
        restUserExtraMockMvc.perform(delete("/api/user-extras/{id}", userExtra.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserExtra.class);
        UserExtra userExtra1 = new UserExtra();
        userExtra1.setId(1L);
        UserExtra userExtra2 = new UserExtra();
        userExtra2.setId(userExtra1.getId());
        assertThat(userExtra1).isEqualTo(userExtra2);
        userExtra2.setId(2L);
        assertThat(userExtra1).isNotEqualTo(userExtra2);
        userExtra1.setId(null);
        assertThat(userExtra1).isNotEqualTo(userExtra2);
    }
}
