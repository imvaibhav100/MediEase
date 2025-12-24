package com.example.backend.dto;

public class BuyNowRequest {
    private String medicineId;
    private String name;
    private double price;
    private int quantity;
    private String genericSource;
    private String category;
    private String salts;
    private String shippingAddress;
    private String paymentMethod;

    public BuyNowRequest() {}

    public String getMedicineId() { return medicineId; }
    public void setMedicineId(String medicineId) { this.medicineId = medicineId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getGenericSource() { return genericSource; }
    public void setGenericSource(String genericSource) { this.genericSource = genericSource; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSalts() { return salts; }
    public void setSalts(String salts) { this.salts = salts; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
