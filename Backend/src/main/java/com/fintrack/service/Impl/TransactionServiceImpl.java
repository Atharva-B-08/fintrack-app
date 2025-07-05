package com.fintrack.service.Impl;

import com.fintrack.dto.*;
import com.fintrack.model.*;
import com.fintrack.repositorys.AccountRepository;
import com.fintrack.repositorys.TransactionRepository;
import com.fintrack.service.TransactionService;
import com.fintrack.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserUtil userUtil;


    @Override
    public void bulkDeleteTransactions(BulkDeleteRequest request) {
        List<Long> ids = request.getTransactionIds();

        // 1. Fetch all transactions
        List<Transaction> transactions = transactionRepository.findAllById(ids);

        if (transactions.isEmpty()) {
            throw new RuntimeException("No transactions found");
        }

        // 2. Group and calculate balance change by account
        Map<Long, BigDecimal> balanceChangeMap = new HashMap<>();
        for (Transaction tx : transactions) {
            BigDecimal change = tx.getType() == TransactionType.EXPENSE
                    ? tx.getAmount()
                    : tx.getAmount().negate();

            balanceChangeMap.merge(tx.getAccount().getId(), change, BigDecimal::add);
        }

        // 3. Delete transactions
        transactionRepository.deleteAll(transactions);

        // 4. Update account balances
        for (Map.Entry<Long, BigDecimal> entry : balanceChangeMap.entrySet()) {
            Account account = accountRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            account.setBalance(account.getBalance().add(entry.getValue()));
            accountRepository.save(account);
        }
    }

    @Override
    public Optional<Transaction> getTransactionByIdAndUserId(Long transactionId, Long userId) {
        return transactionRepository.findByIdAndUserIdWithAccount(transactionId, userId);
    }


    @Transactional
    @Override
    public void processRecurringTransaction(RecurringTransactionRequest req) {
        Transaction original = transactionRepository.findByIdAndUserId(req.getTransactionId(), req.getUserId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        System.out.println(TransactionType.valueOf(req.getType()));
        // 1. Create new transaction
        Transaction newTransaction = new Transaction();
        newTransaction.setUserId(req.getUserId());
        newTransaction.setAccountId(req.getAccountId());
        newTransaction.setAmount(req.getAmount());
        newTransaction.setCategory(req.getCategory());
        newTransaction.setType(TransactionType.valueOf(req.getType()));
        newTransaction.setDescription(req.getDescription() + " (Recurring)");
        newTransaction.setDate(LocalDateTime.now());
        newTransaction.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(newTransaction);

        // 2. Update account balance
        Account account = accountRepository.findById(req.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        BigDecimal change = req.getType().equals("EXPENSE")
                ? req.getAmount().negate()
                : req.getAmount();

        account.setBalance(account.getBalance().add(change));
        accountRepository.save(account);

        // 3. Update original transaction’s recurrence
        original.setLastProcessed(LocalDateTime.now());
        original.setNextRecurringDate(calculateNextRecurringDate(LocalDateTime.now(), req.getRecurringInterval()));
        transactionRepository.save(original);
    }

    @Transactional()
    @Override
    public List<TransactionResWithUser> getDueRecurringTransactions() {


        List<Transaction> dueRecurringTransactions = transactionRepository.findDueRecurringTransactions();
        return dueRecurringTransactions.stream().map(
                t -> {
                    TransactionResWithUser dto = new TransactionResWithUser();
                    dto.setId(t.getId());
                    dto.setAmount(t.getAmount());
                    dto.setType(t.getType().name());
                    dto.setDate(t.getDate());
                    dto.setUserId(t.getUserId());
                    dto.setCategory(t.getCategory());
                    dto.setDescription(t.getDescription());
                    dto.setRecurring(t.isRecurring());
                    dto.setRecurringInterval(t.getRecurringInterval());
                    dto.setNextRecurringDate(t.getNextRecurringDate());
                    return dto;
                }
        ).collect(Collectors.toList());
    }

    @Override
    public MonthlyStatsResponse getMonthlyStats(Long userId, int year, int month) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Transaction> txnsactions = transactionRepository.findByUserIdAndDateBetween(userId, start.atStartOfDay(), end.atTime(23, 59, 59));

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        Map<String, BigDecimal> byCategory = new HashMap<>();

        for (Transaction t : txnsactions) {
            BigDecimal amount = t.getAmount();
            if (t.getType() == TransactionType.EXPENSE) {
                totalExpenses = totalExpenses.add(amount);
                byCategory.put(
                        t.getCategory(),
                        byCategory.getOrDefault(t.getCategory(), BigDecimal.ZERO).add(amount)
                );
            } else {
                totalIncome = totalIncome.add(amount);
            }
        }

        return new MonthlyStatsResponse(
                totalIncome,
                totalExpenses,
                txnsactions.size(),
                byCategory
        );
    }

    @Override
    public BigDecimal getTotalExpenses(Long userId, Long accountId, LocalDateTime startDate) {
        BigDecimal total = transactionRepository.getTotalExpensesForAccount(userId, accountId, startDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {


        User user = userUtil.getCurrentUser();
        if (user == null) throw new RuntimeException("User not found");

        Account account = accountRepository.findById(request.getAccountId()).orElseThrow(() -> new RuntimeException("Account not found"));


        BigDecimal balanceChange = request.getType().equalsIgnoreCase("EXPENSE") ? request.getAmount().negate() : request.getAmount();

        BigDecimal newBalance = account.getBalance().add(balanceChange);

        // Handle recurring date
        LocalDateTime nextRecurringDate = null;
        if (request.isRecurringTxn() && request.getRecurringInterval() != null) {
            nextRecurringDate = calculateNextRecurringDate(request.getDate(), request.getRecurringInterval());
        }

        System.out.println(request.isRecurringTxn());
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setAccountId(account.getId());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory().toLowerCase());
        transaction.setType(TransactionType.valueOf(request.getType()));
        transaction.setDate(request.getDate());
        transaction.setRecurring(request.isRecurringTxn());
        transaction.setRecurringInterval(request.getRecurringInterval() != null
                ? RecurringInterval.valueOf(request.getRecurringInterval())
                : null);
        transaction.setNextRecurringDate(nextRecurringDate);
        transaction.setDescription(request.getDescription());

        transactionRepository.save(transaction);


        // update account balance
        account.setBalance(newBalance);
        accountRepository.save(account);


        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType().toString(),
                transaction.getDate(),
                transaction.getCategory(),
                transaction.isRecurring(),
                transaction.getDescription(),
                transaction.getRecurringInterval() != null
                        ? transaction.getRecurringInterval()
                        : null,
                transaction.getNextRecurringDate()
        );
    }

    @Override
    public TransactionResponse getTransactionById(Long transactionId) {

        User currentUser = userUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not fount or Unauthorized user");
        }

        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));


        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType().toString(),
                transaction.getDate(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getAccountId(),
                transaction.isRecurring(),
                transaction.getRecurringInterval(),
                transaction.getNextRecurringDate()
        );
    }

    @Override
    public TransactionResponse updateTransaction(Long transactionId, TransactionRequest request) {

        User user = userUtil.getCurrentUser();

        Transaction originalTransaction = transactionRepository.findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Account account = originalTransaction.getAccount();

        BigDecimal newBalance = getBigDecimal(request, originalTransaction, account);

        // Update transaction fields

        originalTransaction.setAmount(request.getAmount());
        originalTransaction.setType(TransactionType.valueOf(request.getType()));
        originalTransaction.setDate(request.getDate());
        originalTransaction.setDescription(request.getDescription());
        originalTransaction.setCategory(request.getCategory());
        originalTransaction.setRecurring(request.isRecurringTxn());
        originalTransaction.setRecurringInterval(
                request.isRecurringTxn() ? RecurringInterval.valueOf(request.getRecurringInterval()) : null
        );
        originalTransaction.setNextRecurringDate(
                (request.isRecurringTxn() && request.getRecurringInterval() != null)
                        ? calculateNextRecurringDate(request.getDate(), request.getRecurringInterval())
                        : null
        );

        transactionRepository.save(originalTransaction);

        // Update account balance
        account.setBalance(newBalance);
        accountRepository.save(account);

        return new TransactionResponse(
                account.getId(),
                originalTransaction.getAmount(),
                originalTransaction.getType().toString(),
                originalTransaction.getDate(),
                originalTransaction.getCategory(),
                originalTransaction.isRecurring(),
                originalTransaction.getDescription(),
                originalTransaction.getRecurringInterval() != null ? originalTransaction.getRecurringInterval() : null,
                originalTransaction.getNextRecurringDate()
        );
    }

    @Override
    public List<TransactionResponse> getAllTransactionByUser() {
        User currentUser = userUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not fount or Unauthorized user");
        }

        List<Transaction> allUserTxn = transactionRepository.findByUserId(currentUser.getId());

        return allUserTxn.stream().map(
                txn -> new TransactionResponse(
                        txn.getId(),
                        txn.getAmount(),
                        txn.getType().name(),
                        txn.getDate(),
                        txn.getCategory(),
                        txn.getDescription(),
                        txn.getAccountId(),
                        txn.isRecurring(),
                        txn.getRecurringInterval(),
                        txn.getNextRecurringDate()
                )
        ).collect(Collectors.toList());
    }

    private static BigDecimal getBigDecimal(TransactionRequest request, Transaction originalTransaction, Account account) {
        BigDecimal oldBalanceChange = (originalTransaction.getType() == TransactionType.EXPENSE)
                ? originalTransaction.getAmount().negate()
                : originalTransaction.getAmount();

        BigDecimal newBalanceChange = request.getType().equalsIgnoreCase("EXPENSE")
                ? request.getAmount().negate()
                : request.getAmount();

        BigDecimal netChange = newBalanceChange.subtract(oldBalanceChange);
        BigDecimal newBalance = account.getBalance().add(netChange);
        return newBalance;
    }

    // Util method to calculate next recurring date
    private LocalDateTime calculateNextRecurringDate(LocalDateTime date, String interval) {
        return switch (interval) {
            case "DAILY" -> date.plusDays(1);
            case "WEEKLY" -> date.plusWeeks(1);
            case "MONTHLY" -> date.plusMonths(1);
            case "YEARLY" -> date.plusYears(1);
            default -> throw new IllegalArgumentException("Unknown interval: " + interval);
        };
    }
}
