package com.kupujemprodajem.kupujemprodajem.controller;

import com.kupujemprodajem.kupujemprodajem.model.Ad;
import com.kupujemprodajem.kupujemprodajem.model.Category;
import com.kupujemprodajem.kupujemprodajem.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
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
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        Ad ad = new Ad();
        ad.setTitle(title);
        ad.setDescription(description);
        ad.setPrice(price);
        ad.setCity(city);
        ad.setLatitude(latitude);
        ad.setLongitude(longitude);
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

    @GetMapping("/paged")
    public ResponseEntity<Page<Ad>> getAllAdsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adService.getAllAdsPaged(page, size));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ad>> getAdsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adService.getAdsByUserId(userId));
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getAdPhoto(@PathVariable Long id) {
        try {
            Path photoPath = adService.getPhotoPathByAdId(id);
            if (photoPath == null || !Files.exists(photoPath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(photoPath.toUri());

            String contentType = Files.probeContentType(photoPath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
