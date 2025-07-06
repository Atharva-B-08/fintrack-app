package com.fintrack.controller;

import com.fintrack.dto.AccountRequest;
import com.fintrack.dto.AccountResponse;
import com.fintrack.dto.AccountWithTransactionsResponse;
import com.fintrack.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccountController {

    @Autowired
    private AccountService accountService;


    @PostMapping("/create-account")
    public ResponseEntity<AccountResponse> createAccount(
            @RequestBody AccountRequest request,
            HttpServletRequest httpRequest
    ) {
//        System.out.println(request.getName());
//        System.out.println("request default "+request.isDefault());
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-accounts")
    public ResponseEntity<List<AccountResponse>> getAccountsByUser() {
        List<AccountResponse> accountsByUser = accountService.getAccountsByUser();
        return ResponseEntity.ok(accountsByUser);
    }

    @PutMapping("/set-default/{accountId}")
    public ResponseEntity<?> setDefaultAccount(@PathVariable Long accountId) {
        try {
            AccountResponse response = accountService.updateDefaultAccount(accountId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<AccountWithTransactionsResponse> getAccountWithTransactions(
            @PathVariable("id") Long accountId
    ) {

        try {
            AccountWithTransactionsResponse accTransactionRes = accountService.getAccountWithTransactions(accountId);
            return ResponseEntity.ok(accTransactionRes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if not found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Return 500 for other errors
        }
    }
}
