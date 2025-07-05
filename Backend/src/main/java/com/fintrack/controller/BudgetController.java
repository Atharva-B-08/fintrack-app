package com.fintrack.controller;


import com.fintrack.dto.BudgetRequest;
import com.fintrack.dto.BudgetWithUserDTO;
import com.fintrack.dto.CurrentBudgetResponse;
import com.fintrack.model.Budget;
import com.fintrack.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;


    /**
     * Get the current month's budget and expenses for a specific account.
     *
     * @param accountId the ID of the account
     * @return CurrentBudgetResponse containing budget details and total expenses
     */
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentBudget(@RequestParam("accountId") Long accountId) {
        try {
            CurrentBudgetResponse response = budgetService.getCurrentBudget(accountId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Return error message with 400 Bad Request
            return ResponseEntity.badRequest().body(
                    "❌ Error fetching current budget: " + e.getMessage()
            );
        } catch (Exception e) {
            // Return generic server error with 500
            return ResponseEntity.status(500).body(
                    "🚨 Server error occurred while fetching budget."
            );
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateBudget(@RequestBody BudgetRequest request) {
        try {
            Budget updatedBudget = budgetService.updateOrCreateBudget(request.getAmount());
            return ResponseEntity.ok(updatedBudget);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


    @GetMapping("/inngest/with-default-accounts")
    public ResponseEntity<List<BudgetWithUserDTO>> getBudgetsWithDefaultAccounts() {
        List<BudgetWithUserDTO> response = budgetService.getBudgetsWithDefaultAccounts();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/inngest/{id}/alert-sent")
    public ResponseEntity<?> updateLastAlertSent(@PathVariable Long id) {
        try {
            budgetService.updateLastAlertSent(id);
            return ResponseEntity.ok("Last alert timestamp updated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
