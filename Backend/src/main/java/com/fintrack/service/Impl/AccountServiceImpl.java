package com.fintrack.service.Impl;

import com.fintrack.dto.AccountRequest;
import com.fintrack.dto.AccountResponse;
import com.fintrack.dto.AccountWithTransactionsResponse;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.model.Account;
import com.fintrack.model.User;
import com.fintrack.repositorys.AccountRepository;
import com.fintrack.repositorys.TransactionRepository;
import com.fintrack.repositorys.UserRepository;
import com.fintrack.service.AccountService;
import com.fintrack.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserUtil userUtil;


    @Override
    public AccountResponse createAccount(AccountRequest request) {
        // 1. Get the logged-in user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Email is the username

        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");

        // 2. Parse and validate balance
        BigDecimal balance;
        try {
            balance = new BigDecimal(request.getBalance());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid balance format");
        }

        // 3. Check existing accounts to determine default
        List<Account> existingAccounts = accountRepository.findByUserId(user.getId());
//        System.out.println(existingAccounts.isEmpty());
//        System.out.println("in account service "+request.isDefault());
        boolean shouldBeDefault = existingAccounts.isEmpty() || (request.isDefault());
//        System.out.println(shouldBeDefault);

        // 4. Unset other default accounts if this one is default
        if (shouldBeDefault) {
            existingAccounts.stream()
                    .filter(Account::isDefault)
                    .forEach(acc -> {
                        acc.setDefault(false);
                        accountRepository.save(acc);
                    });
        }

        // 5. Create and save new account
        Account account = new Account();
        account.setName(request.getName());
        account.setType(request.getType());
        account.setBalance(balance);
        account.setUserId(user.getId());
        account.setDefault(shouldBeDefault);

        Account saved = accountRepository.save(account);

        // 6. Convert to response DTO
        return new AccountResponse(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getBalance(),
                saved.isDefault()
        );
    }

    @Override
    public List<AccountResponse> getAccountsByUser() {

        User user = userUtil.getCurrentUser();
        if (user == null) throw new RuntimeException("User not found");

        // 3. Fetch user accounts ordered by creation date (latest first)
        List<Account> accounts = accountRepository.findByUserIdWithTransactions(user.getId());

        // 4. Map each account to AccountResponse
        return accounts.stream().map(account -> {
            AccountResponse response = new AccountResponse(
                    account.getId(),
                    account.getName(),
                    account.getType(),
                    account.getBalance(),
                    account.isDefault()
            );

            // 5. Optionally set transaction count
            int count = account.getTransactions() != null ? account.getTransactions().size() : 0;
            response.setTransactionCount(count);

            return response;
        }).toList();
    }

    @Override
    @Transactional
    public AccountResponse updateDefaultAccount(Long accountId) {
        // Get logged-in user
        User user = userUtil.getCurrentUser();

        // Validate ownership
        Account targetAccount = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found or not owned by user"));

        // Unset all other default accounts
        List<Account> userAccounts = accountRepository.findByUserId(user.getId());
        for (Account acc : userAccounts) {
            if (acc.isDefault()) {
                acc.setDefault(false);
                accountRepository.save(acc);
            }
        }

        // Set selected account as default
        targetAccount.setDefault(true);
        Account updatedAccount = accountRepository.save(targetAccount);

        AccountResponse response = new AccountResponse(
                updatedAccount.getId(),
                updatedAccount.getName(),
                updatedAccount.getType(),
                updatedAccount.getBalance(),
                updatedAccount.isDefault()
        );

        // Optionally add transaction count if needed
        if (updatedAccount.getTransactions() != null) {
            response.setTransactionCount(updatedAccount.getTransactions().size());
        }

        return response;
    }

    @Override
    public AccountWithTransactionsResponse getAccountWithTransactions(Long accountId) {


        // Fetch account and all its transactions (with JOIN FETCH)
        Account account = accountRepository.findByAccountIdWithTransaction(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<TransactionResponse> transactionResponses = account.getTransactions().stream()
                .map(tx -> new TransactionResponse(
                        tx.getId(),
                        tx.getAmount(),
                        tx.getType().name(),
                        tx.getDate(),
                        tx.getCategory(),
                        tx.isRecurring(),
                        tx.getDescription(),
                        tx.getRecurringInterval(),
                        tx.getNextRecurringDate()
                ))
                .toList();

        return new AccountWithTransactionsResponse(
                account.getId(),
                account.getName(),
                account.getType(),
                account.getBalance(),
                account.isDefault(),
                transactionResponses.size(),  // total transactions count
                transactionResponses
        );
    }
}
