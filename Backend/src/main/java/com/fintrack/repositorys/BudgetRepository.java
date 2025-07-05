package com.fintrack.repositorys;

import com.fintrack.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findFirstByUserId(Long userId);

    @Query("SELECT b FROM Budget b JOIN FETCH b.user u JOIN FETCH u.accounts a WHERE a.isDefault = true")
    List<Budget> findAllWithDefaultAccounts();
}
