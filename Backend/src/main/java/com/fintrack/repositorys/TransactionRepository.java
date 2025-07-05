package com.fintrack.repositorys;

import com.fintrack.dto.TransactionResponse;
import com.fintrack.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Fetch all transactions by user
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.date DESC")
    List<Transaction> findByUserId(@Param("userId") Long userId);

    Page<Transaction> findByAccountId(Long accountId, Pageable pageable);

    // Fetch transactions by account
    List<Transaction> findByAccountId(Long accountId);

    // Fetch transaction by ID and user (for secure access)
    @Query("SELECT t FROM Transaction t JOIN FETCH t.account WHERE t.id = :id AND t.userId = :userId")
    Optional<Transaction> findByIdAndUserIdWithAccount(@Param("id") Long id, @Param("userId") Long userId);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    // Fetch all recurring transactions
    List<Transaction> findByIsRecurringTrue();

    // Fetch all transactions within a date range for a user
    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

    // Fetch transactions by category
    List<Transaction> findByUserIdAndCategory(Long userId, String category);

    void deleteByAccountId(Long accountId);


    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.userId = :userId AND t.account.id = :accountId AND " +
            "t.type = 'EXPENSE' AND t.date BETWEEN :start AND :end")
    BigDecimal getMonthlyExpensesForAccount(
            @Param("userId") Long userId,
            @Param("accountId") Long accountId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.isRecurring = true
              AND t.status = 'COMPLETED'
              AND (t.lastProcessed IS NULL OR t.nextRecurringDate <= CURRENT_TIMESTAMP())
            """)
    List<Transaction> findDueRecurringTransactions();


    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId= :userId AND t.accountId= :accountId AND t.date >= :startDate AND t.type= 'EXPENSE' ")
    BigDecimal getTotalExpensesForAccount(@Param("userId") Long userId, @Param("accountId") Long accountId, @Param("startDate") LocalDateTime startDate);
}
