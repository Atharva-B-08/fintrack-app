package com.fintrack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintrack.model.AccountType;

public class AccountRequest {


    private String name;
    private AccountType type;
    private String balance;

    @JsonProperty("isDefault")
    private Boolean isDefault;

    // getters ad setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }

    public Boolean isDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }
}
