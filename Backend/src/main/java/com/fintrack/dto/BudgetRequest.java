package com.fintrack.dto;

import java.math.BigDecimal;

public class BudgetRequest {
    private BigDecimal amount;

    // Getters and setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
