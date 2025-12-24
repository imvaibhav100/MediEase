package com.example.backend.repository;

import com.example.backend.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserEmail(String userEmail);
    Optional<Cart> findByUserId(String userId);
    void deleteByUserEmail(String userEmail);
}
