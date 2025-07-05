package com.fintrack.repositorys;

import com.fintrack.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface AccountRepository extends JpaRepository<Account, Long> {

    // Get all accounts for a specific user
    List<Account> findByUserId(Long userId);


    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.transactions WHERE a.userId = :userId ORDER BY a.createdAt DESC")
    List<Account> findByUserIdWithTransactions(@Param("userId") Long userId);


    // Get account by ID and userId (for security/multi-tenancy)
    Optional<Account> findByIdAndUserId(Long accountId, Long userId);

    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.transactions WHERE a.id = :accountId")
    Optional<Account> findByAccountIdWithTransaction(@Param("accountId") Long accountId);

    // Get the default account for a user
//    Optional<Account> findByUserIdAndIsDefaultTrue(Long userId);

}
