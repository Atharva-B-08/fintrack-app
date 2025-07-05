package com.fintrack.service;


import com.fintrack.dto.UserWithAllAccountResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    List<UserWithAllAccountResponse> getAllUsersWithAccounts();
}
