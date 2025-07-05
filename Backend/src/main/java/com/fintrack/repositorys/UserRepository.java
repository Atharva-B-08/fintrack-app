package com.fintrack.repositorys;

import com.fintrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u where u.email = :email")
    public User findByEmail(String email);


    public boolean existsByEmail(String Email);


    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.accounts")
    List<User> findAllWithAccounts();
}
