package com.example.backend.dto;

public class GenericMedicineDto {
    private String drugCode;
    private String genericName;
    private String unitSize;
    private Double mrp;
    private String composition;

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
}
