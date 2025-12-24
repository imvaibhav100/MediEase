package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "generic_medicine")
public class GenericMedicine {
            public GenericMedicine(String drugCode, String genericName, String unitSize, Double mrp, String composition, List<String> brandNames) {
                this.drugCode = drugCode;
                this.genericName = genericName;
                this.unitSize = unitSize;
                this.mrp = mrp;
                this.composition = composition;
                this.brandNames = brandNames;
            }
        public GenericMedicine() {}
    @Id
    private String id;
    private String drugCode;
    private String genericName;
    private String unitSize;
    private Double mrp;
    private String composition;
    private List<String> brandNames;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public String getUnitSize() { return unitSize; }
    public void setUnitSize(String unitSize) { this.unitSize = unitSize; }
    public Double getMrp() { return mrp; }
    public void setMrp(Double mrp) { this.mrp = mrp; }
    public String getComposition() { return composition; }
    public void setComposition(String composition) { this.composition = composition; }
    public List<String> getBrandNames() { return brandNames; }
    public void setBrandNames(List<String> brandNames) { this.brandNames = brandNames; }
}
