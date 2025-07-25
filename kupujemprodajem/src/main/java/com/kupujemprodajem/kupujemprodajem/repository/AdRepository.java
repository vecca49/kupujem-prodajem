package com.kupujemprodajem.kupujemprodajem.repository;

import com.kupujemprodajem.kupujemprodajem.model.Ad;
import com.kupujemprodajem.kupujemprodajem.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByUserId(Long userId);
    Page<Ad> findByCategoryOrCity(Category category, String city, Pageable pageable);
    Page<Ad> findByCategory(Category category, Pageable pageable);


}
