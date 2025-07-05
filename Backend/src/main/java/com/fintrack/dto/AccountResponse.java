package com.fintrack.dto;

import com.fintrack.model.AccountType;

import java.math.BigDecimal;

public class AccountResponse {

    private Long id;
    private String name;
    private AccountType type;
    private BigDecimal balance;
    private boolean isAccountDefault;
    private Integer transactionCount;

    public AccountResponse() {
    }

    public AccountResponse(Long id, String name, AccountType type, BigDecimal balance, boolean isAccountDefault) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.balance = balance;
        this.isAccountDefault = isAccountDefault;
    }


    // Getters


    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public void setAccountDefault(boolean accountDefault) {
        isAccountDefault = accountDefault;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public AccountType getType() {
        return type;
    }

    public BigDecimal getBalance() {
        return balance;
    }


    public boolean isAccountDefault() {
        return isAccountDefault;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }


    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }


}
