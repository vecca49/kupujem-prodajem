package com.kupujemprodajem.kupujemprodajem.repository;

import com.kupujemprodajem.kupujemprodajem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
}
