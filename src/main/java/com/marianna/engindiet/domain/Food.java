package com.marianna.engindiet.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Food.
 */
@Entity
@Table(name = "food")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @DecimalMax(value = "400")
    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @NotNull
    @Column(name = "date_of_consumption", nullable = false)
    private Instant dateOfConsumption;

    @OneToMany(mappedBy = "food")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Nutrien> contains = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("")
    @JoinColumn(name = "user_extra_food_id")
    private UserExtra userExtraFood;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Food name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getQuantity() {
        return quantity;
    }

    public Food quantity(Double quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Instant getDateOfConsumption() {
        return dateOfConsumption;
    }

    public Food dateOfConsumption(Instant dateOfConsumption) {
        this.dateOfConsumption = dateOfConsumption;
        return this;
    }

    public void setDateOfConsumption(Instant dateOfConsumption) {
        this.dateOfConsumption = dateOfConsumption;
    }

    public Set<Nutrien> getContains() {
        return contains;
    }

    public Food contains(Set<Nutrien> nutriens) {
        this.contains = nutriens;
        return this;
    }

    public Food addContains(Nutrien nutrien) {
        this.contains.add(nutrien);
        nutrien.setFood(this);
        return this;
    }

    public Food removeContains(Nutrien nutrien) {
        this.contains.remove(nutrien);
        nutrien.setFood(null);
        return this;
    }

    public void setContains(Set<Nutrien> nutriens) {
        this.contains = nutriens;
    }

    public UserExtra getUserExtraFood() {
        return userExtraFood;
    }

    public Food userExtraFood(UserExtra userExtra) {
        this.userExtraFood = userExtra;
        return this;
    }

    public void setUserExtraFood(UserExtra userExtra) {
        this.userExtraFood = userExtra;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Food food = (Food) o;
        if (food.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), food.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Food{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", quantity=" + getQuantity() +
            ", dateOfConsumption='" + getDateOfConsumption() + "'" +
            "}";
    }
}
