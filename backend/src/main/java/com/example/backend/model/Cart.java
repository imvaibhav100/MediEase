package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Document(collection = "carts")
public class Cart {
    @Id
    private String id;
    private String userId;
    private String userEmail;
    private List<CartItem> items;
    private Date createdAt;
    private Date updatedAt;

    public Cart() {
        this.items = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public Cart(String userId, String userEmail) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.items = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { 
        this.items = items; 
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public void addItem(CartItem item) {
        // Check if item already exists
        for (CartItem existingItem : this.items) {
            if (existingItem.getName().equals(item.getName())) {
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                this.updatedAt = new Date();
                return;
            }
        }
        this.items.add(item);
        this.updatedAt = new Date();
    }

    public void removeItem(String medicineName) {
        this.items.removeIf(item -> item.getName().equals(medicineName));
        this.updatedAt = new Date();
    }

    public void updateItemQuantity(String medicineName, int quantity) {
        for (CartItem item : this.items) {
            if (item.getName().equals(medicineName)) {
                if (quantity <= 0) {
                    this.items.remove(item);
                } else {
                    item.setQuantity(quantity);
                }
                this.updatedAt = new Date();
                return;
            }
        }
    }

    public void clearCart() {
        this.items.clear();
        this.updatedAt = new Date();
    }

    public double getTotalAmount() {
        return this.items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public int getTotalItems() {
        return this.items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
