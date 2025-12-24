package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    private String userPhone;
    private List<CartItem> items;
    private double totalAmount;
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    private String paymentMethod; // COD, ONLINE
    private String paymentStatus; // PENDING, PAID
    private String shippingAddress;
    private Date createdAt;
    private Date updatedAt;

    public Order() {
        this.items = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }

    public Order(String userId, String userEmail, List<CartItem> items, double totalAmount) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.items = items;
        this.totalAmount = totalAmount;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { 
        this.status = status; 
        this.updatedAt = new Date();
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { 
        this.paymentStatus = paymentStatus; 
        this.updatedAt = new Date();
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
