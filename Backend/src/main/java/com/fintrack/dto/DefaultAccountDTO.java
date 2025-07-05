package com.fintrack.dto;

import java.math.BigDecimal;

public class DefaultAccountDTO {
    private Long id;
    private String name;
    private boolean isDefault;
    private BigDecimal balance;

    public DefaultAccountDTO(Long id, String name, boolean isDefault, BigDecimal balance) {
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.balance = balance;
    }

    // Getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}

