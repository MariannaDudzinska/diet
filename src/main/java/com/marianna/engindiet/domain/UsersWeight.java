package com.marianna.engindiet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marianna.engindiet.service.UserService;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A UsersWeight.
 */
@Entity
@Table(name = "users_weight")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UsersWeight implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_of_log", nullable = false)
    private LocalDate dateOfLog;

    @NotNull
    @Min(value = 30)
    @Max(value = 400)
    @Column(name = "value_in_kg", nullable = false)
    private Integer valueInKg;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("usersWeights")
    @JoinColumn(name = "user_extra_id")
    private UserExtra userExtra;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateOfLog() {
        return dateOfLog;
    }

    public UsersWeight dateOfLog(LocalDate dateOfLog) {
        this.dateOfLog = dateOfLog;
        return this;
    }

    public void setDateOfLog(LocalDate dateOfLog) {
        this.dateOfLog = dateOfLog;
    }

    public Integer getValueInKg() {
        return valueInKg;
    }

    public UsersWeight valueInKg(Integer valueInKg) {
        this.valueInKg = valueInKg;
        return this;
    }

    public void setValueInKg(Integer valueInKg) {
        this.valueInKg = valueInKg;
    }

    public UserExtra getUserExtra() {
        return userExtra;
    }

    public UsersWeight userExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
        return this;
    }
    /*private UserService userService;

    public UsersWeight userService(UserService userService) {
        this.userService = userService;
        return this;
    }*/
    public void setUserExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
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
        UsersWeight usersWeight = (UsersWeight) o;
        if (usersWeight.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), usersWeight.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UsersWeight{" +
            "id=" + getId() +
            ", dateOfLog='" + getDateOfLog() + "'" +
            ", valueInKg=" + getValueInKg() +
            "}";
    }
}
