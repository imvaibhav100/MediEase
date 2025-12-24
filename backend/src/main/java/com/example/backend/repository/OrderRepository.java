package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmail(String userEmail);
    List<Order> findByUserId(String userId);
    List<Order> findByStatus(String status);
    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
