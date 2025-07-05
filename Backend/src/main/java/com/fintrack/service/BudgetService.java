package com.fintrack.service;

import com.fintrack.dto.BudgetWithUserDTO;
import com.fintrack.dto.CurrentBudgetResponse;
import com.fintrack.model.Budget;

import java.math.BigDecimal;
import java.util.List;

public interface BudgetService {

    CurrentBudgetResponse getCurrentBudget(Long accountId);

    Budget updateOrCreateBudget(BigDecimal amount);

    List<BudgetWithUserDTO> getBudgetsWithDefaultAccounts();

    void updateLastAlertSent(Long budgetId);
}
