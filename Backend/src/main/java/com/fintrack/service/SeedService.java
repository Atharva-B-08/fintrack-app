package com.fintrack.service;

import com.fintrack.dto.SeedRequest;
import com.fintrack.model.Account;
import com.fintrack.model.Transaction;
import com.fintrack.repositorys.AccountRepository;
import com.fintrack.repositorys.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SeedService {

    @Autowired
    private TransactionRepository transactionRepo;
    @Autowired
    private AccountRepository accountRepo;


    @Transactional
    public void seedData(SeedRequest request) {
        transactionRepo.deleteByAccountId(request.getAccountId());

        for (SeedRequest.TransactionDto dto : request.getTransactions()) {
            Transaction tx = new Transaction();
            tx.setType(dto.getType());
            tx.setAmount(dto.getAmount());
            tx.setDescription(dto.getDescription());
            tx.setCategory(dto.getCategory());
            tx.setStatus(dto.getStatus());
            tx.setUserId(dto.getUserId());
            tx.setAccountId(dto.getAccountId());
            tx.setDate(dto.getDate());
            tx.setCreatedAt(dto.getCreatedAt());
            tx.setUpdatedAt(dto.getUpdatedAt());

            transactionRepo.save(tx);
        }

        Account account = accountRepo.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setBalance(BigDecimal.valueOf(request.getBalance()));
        accountRepo.save(account);
    }
}
