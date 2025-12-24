package com.example.backend.model;

public class CartItem {
    private String medicineId;
    private String name;
    private double price;
    private int quantity;
    private String genericSource;
    private String category;
    private String salts;

    public CartItem() {}

    public CartItem(String medicineId, String name, double price, int quantity, String genericSource, String category, String salts) {
        this.medicineId = medicineId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.genericSource = genericSource;
        this.category = category;
        this.salts = salts;
    }

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

    public double getTotalPrice() {
        return this.price * this.quantity;
    }
}
