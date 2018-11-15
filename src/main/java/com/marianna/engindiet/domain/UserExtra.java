package com.marianna.engindiet.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.marianna.engindiet.domain.enumeration.STYLE;

import com.marianna.engindiet.domain.enumeration.DIETMODE;

/**
 * A UserExtra.
 */
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @NotNull
    @Column(name = "weight", nullable = false)
    private Integer weight;

    @NotNull
    @Column(name = "height", nullable = false)
    private Integer height;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "lifestyle", nullable = false)
    private STYLE lifestyle;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "diet_mode", nullable = false)
    private DIETMODE dietMode;

    @OneToMany(mappedBy = "userExtra")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<UsersWeight> usersWeights = new HashSet<>();

    @OneToOne @MapsId
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getWeight() {
        return weight;
    }

    public UserExtra weight(Integer weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Integer getHeight() {
        return height;
    }

    public UserExtra height(Integer height) {
        this.height = height;
        return this;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public STYLE getLifestyle() {
        return lifestyle;
    }

    public UserExtra lifestyle(STYLE lifestyle) {
        this.lifestyle = lifestyle;
        return this;
    }

    public void setLifestyle(STYLE lifestyle) {
        this.lifestyle = lifestyle;
    }

    public DIETMODE getDietMode() {
        return dietMode;
    }

    public UserExtra dietMode(DIETMODE dietMode) {
        this.dietMode = dietMode;
        return this;
    }

    public void setDietMode(DIETMODE dietMode) {
        this.dietMode = dietMode;
    }

    public Set<UsersWeight> getUsersWeights() {
        return usersWeights;
    }

    public UserExtra usersWeights(Set<UsersWeight> usersWeights) {
        this.usersWeights = usersWeights;
        return this;
    }

    public UserExtra addUsersWeight(UsersWeight usersWeight) {
        this.usersWeights.add(usersWeight);
        usersWeight.setUserExtra(this);
        return this;
    }

    public UserExtra removeUsersWeight(UsersWeight usersWeight) {
        this.usersWeights.remove(usersWeight);
        usersWeight.setUserExtra(null);
        return this;
    }

    public void setUsersWeights(Set<UsersWeight> usersWeights) {
        this.usersWeights = usersWeights;
    }

    public User getUser() {
        return user;
    }

    public UserExtra user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        UserExtra userExtra = (UserExtra) o;
        if (userExtra.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userExtra.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            ", weight=" + getWeight() +
            ", height=" + getHeight() +
            ", lifestyle='" + getLifestyle() + "'" +
            ", dietMode='" + getDietMode() + "'" +
            "}";
    }
}
