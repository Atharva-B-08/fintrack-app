package com.fintrack.dto;

import com.fintrack.model.AccountType;

import java.math.BigDecimal;
import java.util.List;

public class AccountWithTransactionsResponse {

    private Long id;
    private String name;
    private AccountType type;
    private BigDecimal balance;
    private boolean isAccountDefault;
    private Integer transactionCount;
    private List<TransactionResponse> transactions;

    public AccountWithTransactionsResponse() {
    }

    public AccountWithTransactionsResponse(Long id, String name, AccountType type, BigDecimal balance, boolean isAccountDefault, Integer transactionCount, List<TransactionResponse> transactions) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.balance = balance;
        this.isAccountDefault = isAccountDefault;
        this.transactionCount = transactionCount;
        this.transactions = transactions;
    }

    // Getters and Setters

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

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public boolean isAccountDefault() {
        return isAccountDefault;
    }

    public void setAccountDefault(boolean accountDefault) {
        isAccountDefault = accountDefault;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }

    public List<TransactionResponse> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionResponse> transactions) {
        this.transactions = transactions;
    }
}
