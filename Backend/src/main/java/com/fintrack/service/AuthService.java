package com.fintrack.service;

import com.fintrack.dto.AuthResponse;
import com.fintrack.dto.LoginRequest;
import com.fintrack.dto.MessageResponse;
import com.fintrack.dto.SignUpRequest;

import java.io.IOException;

public interface AuthService {
    
    MessageResponse signup(SignUpRequest request) throws IOException;
    AuthResponse login(LoginRequest request);
}
