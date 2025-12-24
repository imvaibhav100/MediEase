package com.example.backend.controller;

import com.example.backend.dto.AddToCartRequest;
import com.example.backend.dto.UpdateCartItemRequest;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.service.CartService;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private JwtUtil jwtUtil;

    private String extractEmailFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractEmail(token);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            Cart cart = cartService.getCartByUserEmail(email);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching cart: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AddToCartRequest request) {
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
            
            Cart cart = cartService.addToCart(email, item);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            response.put("cart", cart);
            response.put("totalItems", cart.getTotalItems());
            response.put("totalAmount", cart.getTotalAmount());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding to cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove/{medicineName}")
    public ResponseEntity<?> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String medicineName) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Cart cart = cartService.removeFromCart(email, medicineName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item removed from cart");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error removing from cart: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateCartItemRequest request) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Cart cart = cartService.updateCartItemQuantity(email, request.getMedicineName(), request.getQuantity());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart updated");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Cart cart = cartService.clearCart(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cart cleared");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error clearing cart: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            int count = cartService.getCartItemCount(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting cart count: " + e.getMessage());
        }
    }
}
