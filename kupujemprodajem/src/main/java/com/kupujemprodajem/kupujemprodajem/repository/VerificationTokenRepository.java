package com.kupujemprodajem.kupujemprodajem.repository;

import com.kupujemprodajem.kupujemprodajem.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    VerificationToken findByToken(String token);

    @Query("SELECT v FROM VerificationToken v WHERE v.user.id = :userId")
    VerificationToken findByUserId(@Param("userId") Long userId);
}
