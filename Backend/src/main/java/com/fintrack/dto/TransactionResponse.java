package com.fintrack.dto;

import com.fintrack.model.RecurringInterval;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private String type;
    private LocalDateTime date;
    private String category;
    private String description;
    private Long accountId;
    private boolean isRecurring;
    private RecurringInterval recurringInterval;
    private LocalDateTime nextRecurringDate;


    public TransactionResponse() {
    }

    public TransactionResponse(Long id, BigDecimal amount, String type, LocalDateTime date, String category, boolean isRecurring, String description, RecurringInterval recurringInterval, LocalDateTime nextRecurringDate) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
        this.isRecurring = isRecurring;
        this.description = description;
        this.recurringInterval = recurringInterval;
        this.nextRecurringDate = nextRecurringDate;
    }

    public TransactionResponse(Long id, BigDecimal amount, String type, LocalDateTime date, String category, String description, Long accountId, boolean isRecurring, RecurringInterval recurringInterval, LocalDateTime nextRecurringDate) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
        this.description = description;
        this.accountId = accountId;
        this.isRecurring = isRecurring;
        this.recurringInterval = recurringInterval;
        this.nextRecurringDate = nextRecurringDate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setType(String type) {
        this.type = type;
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

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public RecurringInterval getRecurringInterval() {
        return recurringInterval;
    }

    public void setRecurringInterval(RecurringInterval recurringInterval) {
        this.recurringInterval = recurringInterval;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDateTime getNextRecurringDate() {
        return nextRecurringDate;
    }

    public void setNextRecurringDate(LocalDateTime nextRecurringDate) {
        this.nextRecurringDate = nextRecurringDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
