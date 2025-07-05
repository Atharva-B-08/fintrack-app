package com.fintrack.service;

import com.fintrack.dto.*;
import com.fintrack.model.Transaction;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    void bulkDeleteTransactions(BulkDeleteRequest request);

    Optional<Transaction> getTransactionByIdAndUserId(Long transactionId, Long userId);

    void processRecurringTransaction(RecurringTransactionRequest req);

    List<TransactionResWithUser> getDueRecurringTransactions();

    MonthlyStatsResponse getMonthlyStats(Long userId, int year, int month);

    BigDecimal getTotalExpenses(Long userId, Long accountId, LocalDateTime startDate);

    TransactionResponse createTransaction(TransactionRequest request);

    TransactionResponse getTransactionById(Long transactionId);

    TransactionResponse updateTransaction(Long transactionId, TransactionRequest request);

    List<TransactionResponse> getAllTransactionByUser();
}
