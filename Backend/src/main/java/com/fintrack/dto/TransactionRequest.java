package com.fintrack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fintrack.model.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionRequest {

    private String type;
    private BigDecimal amount;
    private Long accountId;
    private String category;
    private LocalDateTime date;
    private String description;

    @JsonProperty("isRecurringTxn")
    private boolean isRecurringTxn;
    private String recurringInterval;

    public TransactionRequest() {
    }

    public TransactionRequest(BigDecimal amount, String type, Long accountId, String category, LocalDateTime date, String description, boolean isRecurringTxn, String recurringInterval) {
        this.amount = amount;
        this.type = type;
        this.accountId = accountId;
        this.category = category;
        this.date = date;
        this.description = description;
        this.isRecurringTxn = isRecurringTxn;
        this.recurringInterval = recurringInterval;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRecurringTxn() {
        return isRecurringTxn;
    }

    public void setRecurringTxn(boolean recurringTxn) {
        isRecurringTxn = recurringTxn;
    }

    public String getRecurringInterval() {
        return recurringInterval;
    }

    public void setRecurringInterval(String recurringInterval) {
        this.recurringInterval = recurringInterval;
    }
}
