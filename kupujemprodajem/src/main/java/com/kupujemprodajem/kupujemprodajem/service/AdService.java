package com.kupujemprodajem.kupujemprodajem.service;
import com.kupujemprodajem.kupujemprodajem.model.Ad;
import com.kupujemprodajem.kupujemprodajem.model.User;
import com.kupujemprodajem.kupujemprodajem.repository.AdRepository;
import com.kupujemprodajem.kupujemprodajem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdService {

    @Autowired
    private  AdRepository adRepository;

    @Autowired
    private UserRepository userRepository;

    private final Path uploadDir = Paths.get("uploads");

    @Transactional
    public  Ad createAd(Ad ad, MultipartFile photo, Long userId) throws IOException {
        if(!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
        Path photoPath = uploadDir.resolve(filename);
        Files.write(photoPath, photo.getBytes());

        ad.setPhoto_url("/uploads/" + filename);
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        ad.setUser(user);

        return  adRepository.save(ad);
    }

    public Ad updateAd(Long adId, Ad updatedAd) {
        return  adRepository.findById(adId).map(existingAd -> {
            existingAd.setTitle(updatedAd.getTitle());
            existingAd.setDescription(updatedAd.getDescription());
            existingAd.setPrice(updatedAd.getPrice());
            existingAd.setCity(updatedAd.getCity());
            existingAd.setCategory(updatedAd.getCategory());
            return adRepository.save(existingAd);
        }).orElseThrow(() -> new IllegalArgumentException("Ad not found"));
    }

    public  void deleteAd(Long adId) {
        adRepository.deleteById(adId);
    }

    public List<Ad>getAllAds() {
        return  adRepository.findAll();
    }

    public  Optional<Ad> getById(Long id) {
        return adRepository.findById(id);
    }

}
