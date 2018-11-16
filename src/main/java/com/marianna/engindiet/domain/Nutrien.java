package com.marianna.engindiet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Nutrien.
 */
@Entity
@Table(name = "nutrien")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Nutrien implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nutrient", nullable = false)
    private String nutrient;

    @Column(name = "unit")
    private String unit;

    @Column(name = "jhi_value")
    private Double value;

    @Column(name = "gm")
    private Double gm;

    @ManyToOne
    @JsonIgnoreProperties("contains")
    @JoinColumn(name = "nutrien")
    private Food food;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNutrient() {
        return nutrient;
    }

    public Nutrien nutrient(String nutrient) {
        this.nutrient = nutrient;
        return this;
    }

    public void setNutrient(String nutrient) {
        this.nutrient = nutrient;
    }

    public String getUnit() {
        return unit;
    }

    public Nutrien unit(String unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getValue() {
        return value;
    }

    public Nutrien value(Double value) {
        this.value = value;
        return this;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getGm() {
        return gm;
    }

    public Nutrien gm(Double gm) {
        this.gm = gm;
        return this;
    }

    public void setGm(Double gm) {
        this.gm = gm;
    }

    public Food getFood() {
        return food;
    }

    public Nutrien food(Food food) {
        this.food = food;
        return this;
    }

    public void setFood(Food food) {
        this.food = food;
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
        Nutrien nutrien = (Nutrien) o;
        if (nutrien.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), nutrien.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Nutrien{" +
            "id=" + getId() +
            ", nutrient='" + getNutrient() + "'" +
            ", unit='" + getUnit() + "'" +
            ", value=" + getValue() +
            ", gm=" + getGm() +
            "}";
    }
}
