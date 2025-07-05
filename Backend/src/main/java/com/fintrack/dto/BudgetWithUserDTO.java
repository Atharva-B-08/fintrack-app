package com.fintrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BudgetWithUserDTO {
    private Long id;
    private BigDecimal amount;
    private Long userId;
    private LocalDateTime lastAlertSent;
    private UserWithDefaultAccountDTO user;

    public BudgetWithUserDTO(Long id, BigDecimal amount, Long userId, LocalDateTime lastAlertSent, UserWithDefaultAccountDTO user) {
        this.id = id;
        this.amount = amount;
        this.userId = userId;
        this.lastAlertSent = lastAlertSent;
        this.user = user;
    }

    // Getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserWithDefaultAccountDTO getUser() {
        return user;
    }

    public void setUser(UserWithDefaultAccountDTO user) {
        this.user = user;
    }

    public LocalDateTime getLastAlertSent() {
        return lastAlertSent;
    }

    public void setLastAlertSent(LocalDateTime lastAlertSent) {
        this.lastAlertSent = lastAlertSent;
    }
}
