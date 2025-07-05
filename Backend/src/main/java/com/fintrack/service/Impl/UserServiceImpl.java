package com.fintrack.service.Impl;

import com.fintrack.dto.AccountResponse;
import com.fintrack.dto.UserWithAllAccountResponse;
import com.fintrack.model.User;
import com.fintrack.repositorys.UserRepository;
import com.fintrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserWithAllAccountResponse> getAllUsersWithAccounts() {

        List<User> users = userRepository.findAllWithAccounts();

        return users.stream().map(user -> {
            UserWithAllAccountResponse userResponse = new UserWithAllAccountResponse();
            userResponse.setId(user.getId());
            userResponse.setName(user.getName());
            userResponse.setEmail(user.getEmail());

            List<AccountResponse> accountResponses = user.getAccounts().stream().map(account -> {
                AccountResponse a = new AccountResponse();
                a.setId(account.getId());
                a.setName(account.getName());
                a.setBalance(account.getBalance());
                a.setType(account.getType());
                a.setAccountDefault(account.isDefault());
                a.setTransactionCount(null);
                return a;
            }).collect(Collectors.toList());

            userResponse.setAccounts(accountResponses);
            return userResponse;
        }).collect(Collectors.toList());
    }
}
