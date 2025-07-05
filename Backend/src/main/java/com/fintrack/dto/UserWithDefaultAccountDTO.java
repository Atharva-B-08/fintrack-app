package com.fintrack.dto;

import java.util.List;

public class UserWithDefaultAccountDTO {
    private Long id;
    private String name;
    private String email;
    private List<DefaultAccountDTO> accounts;

    public UserWithDefaultAccountDTO(Long id, String name, String email, List<DefaultAccountDTO> accounts) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.accounts = accounts;
    }

    // Getters and setters


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<DefaultAccountDTO> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<DefaultAccountDTO> accounts) {
        this.accounts = accounts;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
