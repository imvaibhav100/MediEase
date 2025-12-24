package com.example.backend.dto;

public class UpdateCartItemRequest {
    private String medicineName;
    private int quantity;

    public UpdateCartItemRequest() {}

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
