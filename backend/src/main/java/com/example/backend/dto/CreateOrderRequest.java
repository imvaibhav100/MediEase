package com.example.backend.dto;

public class CreateOrderRequest {
    private String shippingAddress;
    private String paymentMethod; // COD, ONLINE

    public CreateOrderRequest() {}

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
