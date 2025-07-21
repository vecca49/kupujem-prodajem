package com.kupujemprodajem.kupujemprodajem.controller;

import com.kupujemprodajem.kupujemprodajem.model.Ad;
import com.kupujemprodajem.kupujemprodajem.model.Category;
import com.kupujemprodajem.kupujemprodajem.service.AdService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/ads")
public class AdController {

    @Autowired
    private AdService adService;

    @PostMapping
    public ResponseEntity<Ad> createAd(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("city") String city,
            @RequestParam("category") String category,
            @RequestParam("userId") Long userId,
            @RequestParam("photo") MultipartFile photo
    ) {
        Ad ad = new Ad();
        ad.setTitle(title);
        ad.setDescription(description);
        ad.setPrice(price);
        ad.setCity(city);
        ad.setCategory(Enum.valueOf(Category.class, category));

        try {
            Ad created = adService.createAd(ad, photo, userId);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ad> updateAd(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("city") String city,
            @RequestParam("category") String category,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            Ad updatedAd = new Ad();
            updatedAd.setTitle(title);
            updatedAd.setDescription(description);
            updatedAd.setPrice(price);
            updatedAd.setCity(city);
            updatedAd.setCategory(Enum.valueOf(Category.class, category));

            Ad ad = adService.updateAd(id, updatedAd, photo);
            return ResponseEntity.ok(ad);
        } catch (IllegalArgumentException | IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id) {
        adService.deleteAd(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Ad>> getAllAds() {
        return ResponseEntity.ok(adService.getAllAds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ad> getAdById(@PathVariable Long id) {
        return adService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
