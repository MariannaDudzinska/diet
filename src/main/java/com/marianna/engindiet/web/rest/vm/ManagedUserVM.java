package com.marianna.engindiet.web.rest.vm;

import com.marianna.engindiet.domain.enumeration.DIETMODE;
import com.marianna.engindiet.domain.enumeration.STYLE;
import com.marianna.engindiet.service.dto.UserDTO;
import javax.validation.constraints.Size;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends UserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

     private Integer weight;
        private Integer height;
        private STYLE lifestyle;
        private DIETMODE dietMode;

    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getHeight() {
            return height;
        }

        public void setHeight(Integer height) {
            this.height = height;
        }

        public Integer getWeight() {
            return weight;
        }

        public void setWeight(Integer weight) {
            this.weight = weight;
        }

        public DIETMODE getDietMode() {
            return dietMode;
        }

        public void setDietMode(DIETMODE dietMode) {
            this.dietMode = dietMode;
        }

        public STYLE getLifestyle() {
            return lifestyle;
        }
        public void setLifestyle(STYLE lifestyle) {
            this.lifestyle = lifestyle;
        }

    @Override
    public String toString() {
        return "ManagedUserVM{" +
            "} " + super.toString();
    }
}
