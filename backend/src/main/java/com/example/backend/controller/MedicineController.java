
package com.example.backend.controller;

import com.example.backend.model.Medicine;
import com.example.backend.service.MedicineService;
import com.example.backend.service.GenericFinderService;
import com.example.backend.service.GenericFinderService.GenericSearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private GenericFinderService genericFinderService;

    /**
     * Main API: Find generic alternatives for a branded medicine
     * Input: branded medicine name (e.g., "Crocin", "Dolo 650", "Combiflam")
     * Output: Salt composition + generic alternatives from our database
     */
    @GetMapping("/find-generic")
    public ResponseEntity<?> findGeneric(@RequestParam String brandName) {
        if (brandName == null || brandName.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Please provide a medicine name");
            return ResponseEntity.badRequest().body(error);
        }
        
        GenericSearchResult result = genericFinderService.findGenericAlternatives(brandName.trim());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", result.isFound());
        response.put("verified", result.isVerified()); // Whether data is from verified database
        response.put("brandedMedicine", result.getBrandedMedicine());
        response.put("saltComposition", result.getSaltComposition());
        response.put("message", result.getMessage());
        
        if (result.isFound()) {
            response.put("genericAlternatives", result.getGenericAlternatives());
            response.put("totalAlternatives", result.getGenericAlternatives().size());
            
            // Calculate savings if we have alternatives
            if (!result.getGenericAlternatives().isEmpty()) {
                Medicine cheapest = result.getGenericAlternatives().get(0);
                response.put("cheapestGeneric", cheapest.getName());
                response.put("cheapestPrice", cheapest.getPrice());
                response.put("source", cheapest.getGenericSource());
            }
        } else {
            response.put("genericAlternatives", new ArrayList<>());
            response.put("totalAlternatives", 0);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get only salt composition for a branded medicine
     */
    @GetMapping("/get-salt")
    public ResponseEntity<?> getSaltComposition(@RequestParam String brandName) {
        if (brandName == null || brandName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide a medicine name"));
        }
        
        List<String> salts = genericFinderService.getSaltComposition(brandName.trim());
        
        Map<String, Object> response = new HashMap<>();
        response.put("brandedMedicine", brandName);
        
        if (salts != null && !salts.isEmpty() && !salts.get(0).equalsIgnoreCase("not found")) {
            response.put("found", true);
            response.put("saltComposition", salts);
            response.put("saltString", String.join(" + ", salts));
        } else {
            response.put("found", false);
            response.put("saltComposition", null);
            response.put("message", "Salt composition not found for '" + brandName + "'");
        }
        
        return ResponseEntity.ok(response);
    }

                // Fast live search suggestion endpoint
                @GetMapping("/suggest-words")
                public ResponseEntity<?> suggestWords(@RequestParam String q) {
                    // Lowercase query for case-insensitive match
                    String query = q.trim().toLowerCase();
                    if (query.isEmpty()) return ResponseEntity.ok(List.of());
                    // Suggest from in-memory CSV map (generic names + brand names)
                    Set<String> suggestions = new LinkedHashSet<>();
                    for (Medicine med : com.example.backend.service.MedicineService.csvMedicineMap.values()) {
                        if (med.getName() != null && med.getName().toLowerCase().contains(query)) {
                            suggestions.add(med.getName());
                        }
                        if (med.getBrandNames() != null) {
                            for (String brand : med.getBrandNames()) {
                                if (brand != null && brand.toLowerCase().contains(query)) {
                                    suggestions.add(brand);
                                }
                            }
                        }
                        if (suggestions.size() >= 10) break; // Limit to 10 suggestions
                    }
                    return ResponseEntity.ok(new ArrayList<>(suggestions));
                }
            // Professional endpoint: get all info for a searched medicine (by name)
            @GetMapping("/medicine-info")
            public ResponseEntity<?> getMedicineInfo(@RequestParam String name) {
                // Try CSV in-memory first
                Medicine med = com.example.backend.service.MedicineService.csvMedicineMap.get(name.toLowerCase());
                if (med != null) {
                    return ResponseEntity.ok(med);
                }
                // Try DB
                List<Medicine> found = medicineService.searchMedicines(name);
                if (!found.isEmpty()) {
                    return ResponseEntity.ok(found.get(0));
                }
                // Not found
                return ResponseEntity.status(404).body("Medicine not found.");
            }
        // Brand-to-generic suggestion endpoint
        @GetMapping("/suggest-generic")
        public ResponseEntity<?> suggestGeneric(@RequestParam String brandName) {
            List<Medicine> generics = medicineService.suggestGenericForBrand(brandName);
            if (generics.isEmpty()) {
                return ResponseEntity.status(404).body("No generic found for this brand name.");
            }
            return ResponseEntity.ok(generics);
        }
    @Autowired
    private MedicineService medicineService;

    @GetMapping("/search")
    public ResponseEntity<?> searchMedicine(@RequestParam String query) {
        List<Medicine> medicines = medicineService.searchMedicines(query);
        if (medicines.isEmpty()) {
            return ResponseEntity.status(404).body("Medicine not found and could not be scraped.");
        }
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/alternatives")
    public ResponseEntity<?> getAlternatives(@RequestParam String brandName) {
        List<Medicine> alternatives = medicineService.getAlternatives(brandName);
        if (alternatives.isEmpty()) {
            return ResponseEntity.status(404).body("No alternatives found.");
        }
        return ResponseEntity.ok(alternatives);
    }

    @DeleteMapping("/debug/delete-montair-lc")
    public ResponseEntity<?> deleteMontairLC() {
        long deleted = medicineService.deleteMedicineByName("Montair LC");
        return ResponseEntity.ok("Deleted count: " + deleted);
    }

    @PostMapping("/debug/delete-montair-lc")
    public ResponseEntity<?> deleteMontairLCManual() {
        medicineService.deleteMontairLC();
        return ResponseEntity.ok("Montair LC deleted");
    }

    @PostMapping("/debug/delete-azithral-500")
    public ResponseEntity<?> deleteAzithral500Manual() {
        medicineService.deleteMedicineByName("Azithral 500");
        return ResponseEntity.ok("Azithral 500 deleted");
    }

    // Get medicines by source (jan-aushadhi, zeelabs, dava-india, all)
    @GetMapping("/medicines-by-source")
    public ResponseEntity<?> getMedicinesBySource(@RequestParam(defaultValue = "all") String source) {
        List<Medicine> result = new ArrayList<>();
        for (Medicine med : com.example.backend.service.MedicineService.csvMedicineMap.values()) {
            String medSource = med.getGenericSource() != null ? med.getGenericSource().toLowerCase() : "";
            boolean shouldInclude = false;
            if (source.equals("all")) {
                shouldInclude = true;
            } else if (source.equals("jan-aushadhi") && medSource.contains("jan aushadhi")) {
                shouldInclude = true;
            } else if (source.equals("zeelabs") && medSource.contains("zeelabs")) {
                shouldInclude = true;
            } else if (source.equals("dava-india") && medSource.contains("dava india")) {
                shouldInclude = true;
            }
            if (shouldInclude) {
                result.add(med);
            }
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Scrape salt composition from 1mg.com for any branded medicine
     * This endpoint directly scrapes 1mg.com without checking local database
     * Useful for testing scraping or getting info for unknown medicines
     */
    @GetMapping("/scrape-composition")
    public ResponseEntity<?> scrapeComposition(@RequestParam String brandName) {
        if (brandName == null || brandName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide a medicine name"));
        }
        
        List<String> salts = genericFinderService.getSaltComposition(brandName.trim());
        
        Map<String, Object> response = new HashMap<>();
        response.put("brandName", brandName);
        response.put("source", "1mg.com + local database");
        
        if (salts != null && !salts.isEmpty() && !salts.get(0).equalsIgnoreCase("not found")) {
            response.put("success", true);
            response.put("saltComposition", salts);
            response.put("saltString", String.join(" + ", salts));
            
            // Also search for generics using static method
            List<Medicine> generics = MedicineService.findBySalts(salts);
            response.put("genericAlternatives", generics);
            response.put("alternativesCount", generics.size());
        } else {
            response.put("success", false);
            response.put("message", "Could not find salt composition for '" + brandName + "'");
        }
        
        return ResponseEntity.ok(response);
    }
}
