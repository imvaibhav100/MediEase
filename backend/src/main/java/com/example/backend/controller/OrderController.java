package com.example.backend.controller;

import com.example.backend.dto.BuyNowRequest;
import com.example.backend.dto.CreateOrderRequest;
import com.example.backend.model.CartItem;
import com.example.backend.model.Order;
import com.example.backend.service.OrderService;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private JwtUtil jwtUtil;

    private String extractEmailFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractEmail(token);
        }
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateOrderRequest request) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Order order = orderService.createOrderFromCart(
                email, 
                request.getShippingAddress(), 
                request.getPaymentMethod()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully");
            response.put("order", order);
            response.put("orderId", order.getId());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/buy-now")
    public ResponseEntity<?> buyNow(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody BuyNowRequest request) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            CartItem item = new CartItem(
                request.getMedicineId(),
                request.getName(),
                request.getPrice(),
                request.getQuantity() > 0 ? request.getQuantity() : 1,
                request.getGenericSource(),
                request.getCategory(),
                request.getSalts()
            );
            
            Order order = orderService.createBuyNowOrder(
                email, 
                item,
                request.getShippingAddress(), 
                request.getPaymentMethod()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully");
            response.put("order", order);
            response.put("orderId", order.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            List<Order> orders = orderService.getOrdersByUserEmail(email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching orders: " + e.getMessage());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                if (order.getUserEmail().equals(email)) {
                    return ResponseEntity.ok(order);
                }
                return ResponseEntity.status(403).body("Forbidden");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching order: " + e.getMessage());
        }
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String orderId) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Order order = orderService.cancelOrder(orderId, email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order cancelled successfully");
            response.put("order", order);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling order: " + e.getMessage());
        }
    }
}
