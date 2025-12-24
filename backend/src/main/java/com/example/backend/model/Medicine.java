package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "medicines")
public class Medicine {
    @Id
    private String id;
    private String name;
    private List<String> salts;
    private double price;
    private boolean brand;
    private List<String> brandNames;
    private String genericSource;

    public Medicine() {}
    public Medicine(String name, List<String> salts, double price, boolean isBrand) {
        this.name = name;
        this.salts = salts;
        this.price = price;
        this.brand = isBrand;
        this.brandNames = new java.util.ArrayList<>();
    }
    // Getters and setters
    public List<String> getBrandNames() { return brandNames; }
    public void setBrandNames(List<String> brandNames) { this.brandNames = brandNames; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getSalts() { return salts; }
    public void setSalts(List<String> salts) { this.salts = salts; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isBrand() { return brand; }
    public void setBrand(boolean brand) { this.brand = brand; }
    public String getGenericSource() { return genericSource; }
    public void setGenericSource(String genericSource) { this.genericSource = genericSource; }
}
