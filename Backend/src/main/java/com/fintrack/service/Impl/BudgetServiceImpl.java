package com.fintrack.service.Impl;

import com.fintrack.dto.BudgetWithUserDTO;
import com.fintrack.dto.CurrentBudgetResponse;
import com.fintrack.dto.DefaultAccountDTO;
import com.fintrack.dto.UserWithDefaultAccountDTO;
import com.fintrack.model.Account;
import com.fintrack.model.Budget;
import com.fintrack.model.User;
import com.fintrack.repositorys.AccountRepository;
import com.fintrack.repositorys.BudgetRepository;
import com.fintrack.repositorys.TransactionRepository;
import com.fintrack.service.BudgetService;
import com.fintrack.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private UserUtil userUtil;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public CurrentBudgetResponse getCurrentBudget(Long accountId) {

        User currentUser = userUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User Not found");
        }

        // ✅ Check if the account exists and belongs to the current user
        Account account = accountRepository.findByIdAndUserId(accountId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        // get start and end of current month
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        System.out.println(startOfMonth);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.lengthOfMonth()).atTime(23, 59, 59);
        System.out.println(endOfMonth);

        Budget budget = budgetRepository.findFirstByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("No budget for the user"));

        // Aggregate total expenses for the month for the given account
        BigDecimal currentExpenses = transactionRepository.getMonthlyExpensesForAccount(
                currentUser.getId(), accountId, startOfMonth, endOfMonth
        );

        return new CurrentBudgetResponse(budget, currentExpenses != null ? currentExpenses : BigDecimal.ZERO);
    }

    @Override
    public Budget updateOrCreateBudget(BigDecimal amount) {
        User currentUser = userUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        Optional<Budget> existingBudget = budgetRepository.findFirstByUserId(currentUser.getId());

        Budget budget = existingBudget.orElseGet(() -> {
            Budget newBudget = new Budget();
            newBudget.setUserId(currentUser.getId());
            return newBudget;
        });

        budget.setAmount(amount);
        budget.setUpdatedAt(LocalDateTime.now());

        return budgetRepository.save(budget);
    }

    @Override
    public List<BudgetWithUserDTO> getBudgetsWithDefaultAccounts() {

        List<Budget> budgets = budgetRepository.findAllWithDefaultAccounts();

        return budgets.stream().map(b -> {
            List<DefaultAccountDTO> accountDTOs = b.getUser().getAccounts().stream()
                    .filter(Account::isDefault) // Include only default accounts
                    .map(acc -> new DefaultAccountDTO(
                            acc.getId(),
                            acc.getName(),
                            acc.isDefault(),
                            acc.getBalance()
                    ))
                    .collect(Collectors.toList());

            User user = b.getUser();
            UserWithDefaultAccountDTO userDTO = new UserWithDefaultAccountDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    accountDTOs
            );

            return new BudgetWithUserDTO(
                    b.getId(),
                    b.getAmount(),
                    b.getUserId(),
                    b.getLastAlertSent(),
                    userDTO
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateLastAlertSent(Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setLastAlertSent(LocalDateTime.now());
        budgetRepository.save(budget);
    }
}
