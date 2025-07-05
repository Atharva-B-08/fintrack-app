package com.fintrack.dto;

import com.fintrack.model.Budget;

import java.math.BigDecimal;

public class CurrentBudgetResponse {

    private Budget budget;
    private BigDecimal currentExpenses;

    public CurrentBudgetResponse(Budget budget, BigDecimal currentExpenses) {
        this.budget = budget;
        this.currentExpenses = currentExpenses;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public BigDecimal getCurrentExpenses() {
        return currentExpenses;
    }

    public void setCurrentExpenses(BigDecimal currentExpenses) {
        this.currentExpenses = currentExpenses;
    }
}
