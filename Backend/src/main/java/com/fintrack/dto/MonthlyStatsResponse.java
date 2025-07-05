package com.fintrack.dto;

import java.math.BigDecimal;
import java.util.Map;

public class MonthlyStatsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private int transactionCount;
    private Map<String, BigDecimal> byCategory;

    public MonthlyStatsResponse() {
    }

    public MonthlyStatsResponse(BigDecimal totalIncome, BigDecimal totalExpenses, int transactionCount, Map<String, BigDecimal> byCategory) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.transactionCount = transactionCount;
        this.byCategory = byCategory;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public int getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(int transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Map<String, BigDecimal> getByCategory() {
        return byCategory;
    }

    public void setByCategory(Map<String, BigDecimal> byCategory) {
        this.byCategory = byCategory;
    }
}

