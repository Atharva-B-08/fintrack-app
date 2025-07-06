package com.fintrack.controller;


import com.fintrack.dto.*;
import com.fintrack.model.Transaction;
import com.fintrack.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;


    @PostMapping("/delete")
    public ResponseEntity<?> bulkDeleteTransaction(@RequestBody BulkDeleteRequest request) {

        try {
            transactionService.bulkDeleteTransactions(request);
            return ResponseEntity.ok(new MessageResponse("Transactions deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to delete transactions: " + e.getMessage()));
        }
    }


    @GetMapping("/inngest/{id}")
    public ResponseEntity<?> getTransactionById(
            @PathVariable Long id,
            @RequestParam Long userId) {

        Optional<Transaction> transaction = transactionService.getTransactionByIdAndUserId(id, userId);
        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Transaction not found"));
        }
    }


    @PostMapping("/inngest/recurring/process")
    public ResponseEntity<?> processRecurringTransaction(@RequestBody RecurringTransactionRequest request) {
        transactionService.processRecurringTransaction(request);
        return ResponseEntity.ok("Recurring transaction processed.");
    }

    @GetMapping("/inngest/recurring/due")
    public ResponseEntity<?> getDueRecurringTransactions() {
        List<TransactionResWithUser> transactions = transactionService.getDueRecurringTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/inngest/stats/monthly")
    public ResponseEntity<?> getMontylyStats(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        try {
            MonthlyStatsResponse response = transactionService.getMonthlyStats(userId, year, month);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error message " + e.getMessage());
        }
    }

    @GetMapping("/inngest/total-expense")
    public ResponseEntity<Map<String, Object>> getTotalExpenses(
            @RequestParam Long userId,
            @RequestParam Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate
    ) {
        System.out.println(startDate);
        BigDecimal total = transactionService.getTotalExpenses(userId, accountId, startDate);

        Map<String, Object> response = new HashMap<>();
        response.put("totalExpenses", total);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-transaction")
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {

        System.out.println(request.isRecurringTxn());
        try {
            TransactionResponse transaction = transactionService.createTransaction(request);
            return ResponseEntity.ok(Map.of("success", true, "data", transaction));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/getTxn")
    public ResponseEntity<?> getTransaction(@RequestParam("edit") Long transactionId) {
        try {
            TransactionResponse transaction = transactionService.getTransactionById(transactionId);
            return ResponseEntity.ok(Map.of("transaction", transaction));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }


    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateTransaction(@PathVariable("id") Long id, @RequestBody TransactionRequest request) {
        try {
            TransactionResponse updatedTxn = transactionService.updateTransaction(id, request);
            return ResponseEntity.ok(Map.of("success", true, "updated_Data", updatedTxn));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/allUserTxn")
    public ResponseEntity<?> getUserAllTransaction() {
        try {
            List<TransactionResponse> allTransactionsOfUser = transactionService.getAllTransactionByUser();
            return ResponseEntity.ok(allTransactionsOfUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
