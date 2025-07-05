package com.fintrack.service;

import com.fintrack.dto.AccountRequest;
import com.fintrack.dto.AccountResponse;
import com.fintrack.dto.AccountWithTransactionsResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(AccountRequest request);

    List<AccountResponse> getAccountsByUser();

    AccountResponse updateDefaultAccount(Long accountId);

    AccountWithTransactionsResponse getAccountWithTransactions(Long accountId);

}
