package com.kupujemprodajem.kupujemprodajem.repository;

import com.kupujemprodajem.kupujemprodajem.model.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
}
