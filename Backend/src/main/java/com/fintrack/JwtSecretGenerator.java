package com.fintrack;

import java.util.Base64;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class JwtSecretGenerator {
    public static void main(String[] args) throws Exception {
        // Create a key generator for HMAC-SHA256
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        keyGen.init(256); // 256-bit key for HS256 algorithm
        SecretKey secretKey = keyGen.generateKey();

        // Encode the secret as a Base64 string
        String base64Secret = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        System.out.println("🔐 Generated JWT Secret (Base64):\n" + base64Secret);
    }
}
