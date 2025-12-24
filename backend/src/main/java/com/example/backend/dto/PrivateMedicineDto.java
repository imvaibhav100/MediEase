package com.example.backend.dto;

public class PrivateMedicineDto {
        private GenericMedicineDto genericMedicine;

        public GenericMedicineDto getGenericMedicine() {
            return genericMedicine;
        }

        public void setGenericMedicine(GenericMedicineDto genericMedicine) {
            this.genericMedicine = genericMedicine;
        }
    private String name;
    private String company;
    private Double mrp;
    private String composition;
    private String genericDrugCode;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public Double getMrp() { return mrp; }
    public void setMrp(Double mrp) { this.mrp = mrp; }
    public String getComposition() { return composition; }
    public void setComposition(String composition) { this.composition = composition; }
    public String getGenericDrugCode() { return genericDrugCode; }
    public void setGenericDrugCode(String genericDrugCode) { this.genericDrugCode = genericDrugCode; }
}
