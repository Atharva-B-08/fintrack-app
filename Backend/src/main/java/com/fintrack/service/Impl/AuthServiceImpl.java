package com.fintrack.service.Impl;

import com.fintrack.config.CustomUserDetails;
import com.fintrack.dto.AuthResponse;
import com.fintrack.dto.LoginRequest;
import com.fintrack.dto.MessageResponse;
import com.fintrack.dto.SignUpRequest;
import com.fintrack.model.User;
import com.fintrack.repositorys.UserRepository;
import com.fintrack.security.JwtUtils;
import com.fintrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;


    @Override
    public MessageResponse signup(SignUpRequest request) throws IOException {
        System.out.println("enterd");
        System.out.println(request.getName());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

        MultipartFile file = request.getImage();
        user.setProfileImageUrl(file.getOriginalFilename());
        userRepository.save(user);

        try {
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Image is uploaded");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload profile image", e);
        }


        return new MessageResponse("User registered successfully!");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        System.out.println("Entered");
        System.out.println(request.getEmail());
        // authenticate credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        System.out.println(authentication);

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtUtils.generateToken(customUserDetails);


        return new AuthResponse(token, customUserDetails.getUsername(), customUserDetails.getUser().getName());
    }
}
