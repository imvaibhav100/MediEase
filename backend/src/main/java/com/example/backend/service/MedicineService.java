package com.example.backend.service;

import com.example.backend.model.Medicine;
import com.example.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.*;

@Service
public class MedicineService {
    // In-memory CSV medicine map: name -> Medicine
    public static final Map<String, Medicine> csvMedicineMap = new HashMap<>();
    
    // Salt composition map: salt_key -> List<Medicine> (for faster salt-based search)
    public static final Map<String, List<Medicine>> saltToMedicinesMap = new HashMap<>();
    
    static {
        // Load all 3 CSV files
        loadJanAushadhiCSV();
        loadDavaIndiaCSV();
        loadZeelabsCSV();
        
        System.out.println("[MedicineService] ✅ Loaded " + csvMedicineMap.size() + " medicines from all CSV files");
        System.out.println("[MedicineService] ✅ Salt index has " + saltToMedicinesMap.size() + " unique salt combinations");
    }
    
    /**
     * Load Jan Aushadhi CSV (2400+ medicines)
     * Format: "Sr No","Drug Code","Generic Name","Unit Size","MRP","Group Name"
     */
    private static void loadJanAushadhiCSV() {
        try (java.io.BufferedReader br = new java.io.BufferedReader(
                new java.io.InputStreamReader(
                    new java.io.FileInputStream("../front/public/Category/Jan Aushadhi.csv"), "UTF-8"))) {
            
            String line = br.readLine(); // skip header
            int count = 0;
            
            while ((line = br.readLine()) != null) {
                try {
                    String[] parts = parseCSVLine(line);
                    if (parts.length < 5) continue;
                    
                    String genericName = parts[2].replace("\"", "").trim();
                    if (genericName.isEmpty()) continue;
                    
                    double price = 0.0;
                    try { 
                        price = Double.parseDouble(parts[4].replace("\"", "").trim()); 
                    } catch (Exception e) {}
                    
                    String group = parts.length > 5 ? parts[5].replace("\"", "").trim() : "";
                    String unitSize = parts[3].replace("\"", "").trim();
                    
                    // Extract salts from generic name
                    List<String> salts = extractSaltsFromName(genericName);
                    
                    Medicine med = new Medicine();
                    med.setName(genericName);
                    med.setPrice(price);
                    med.setBrand(false);
                    med.setGenericSource("Jan Aushadhi");
                    med.setSalts(salts);
                    med.setBrandNames(new ArrayList<>());
                    
                    String key = genericName.toLowerCase();
                    if (!csvMedicineMap.containsKey(key)) {
                        csvMedicineMap.put(key, med);
                        indexBySalts(med, salts);
                        count++;
                    }
                } catch (Exception e) {
                    // Skip problematic lines
                }
            }
            System.out.println("[MedicineService] Jan Aushadhi: " + count + " medicines");
        } catch (Exception e) {
            System.out.println("[MedicineService] Jan Aushadhi CSV error: " + e.getMessage());
        }
    }
    
    /**
     * Load Dava India CSV (500+ medicines)
     * Format: "Medicine Name","MRP (INR)","Unit Size","Group"
     */
    private static void loadDavaIndiaCSV() {
        try (java.io.BufferedReader br = new java.io.BufferedReader(
                new java.io.InputStreamReader(
                    new java.io.FileInputStream("../front/public/Category/Dava India.csv"), "UTF-8"))) {
            
            String line = br.readLine(); // skip header
            int count = 0;
            
            while ((line = br.readLine()) != null) {
                try {
                    String[] parts = parseCSVLine(line);
                    if (parts.length < 3) continue;
                    
                    String medicineName = parts[0].replace("\"", "").trim();
                    if (medicineName.isEmpty()) continue;
                    
                    double price = 0.0;
                    try { 
                        price = Double.parseDouble(parts[1].replace("\"", "").trim()); 
                    } catch (Exception e) {}
                    
                    String unitSize = parts.length > 2 ? parts[2].replace("\"", "").trim() : "";
                    String group = parts.length > 3 ? parts[3].replace("\"", "").trim() : "";
                    
                    // Extract salts from medicine name
                    List<String> salts = extractSaltsFromName(medicineName);
                    
                    Medicine med = new Medicine();
                    med.setName(medicineName + " " + unitSize);
                    med.setPrice(price);
                    med.setBrand(false);
                    med.setGenericSource("Dava India");
                    med.setSalts(salts);
                    med.setBrandNames(new ArrayList<>());
                    
                    String key = med.getName().toLowerCase();
                    if (!csvMedicineMap.containsKey(key)) {
                        csvMedicineMap.put(key, med);
                        indexBySalts(med, salts);
                        count++;
                    }
                } catch (Exception e) {
                    // Skip problematic lines
                }
            }
            System.out.println("[MedicineService] Dava India: " + count + " medicines");
        } catch (Exception e) {
            System.out.println("[MedicineService] Dava India CSV error: " + e.getMessage());
        }
    }
    
    /**
     * Load Zeelabs CSV (400+ medicines)
     * Format: Medicine Name,MRP (₹),Unit Size,Group
     */
    private static void loadZeelabsCSV() {
        try (java.io.BufferedReader br = new java.io.BufferedReader(
                new java.io.InputStreamReader(
                    new java.io.FileInputStream("../front/public/Category/Zeelabs.csv"), "UTF-8"))) {
            
            String line = br.readLine(); // skip header
            int count = 0;
            
            while ((line = br.readLine()) != null) {
                try {
                    String[] parts = line.split(",");
                    if (parts.length < 2) continue;
                    
                    String medicineName = parts[0].trim();
                    if (medicineName.isEmpty()) continue;
                    
                    double price = 0.0;
                    try { 
                        price = Double.parseDouble(parts[1].trim()); 
                    } catch (Exception e) {}
                    
                    String unitSize = parts.length > 2 ? parts[2].trim() : "";
                    String group = parts.length > 3 ? parts[3].trim() : "";
                    
                    // Extract salts from medicine name
                    List<String> salts = extractSaltsFromName(medicineName);
                    
                    Medicine med = new Medicine();
                    med.setName(medicineName);
                    med.setPrice(price);
                    med.setBrand(false);
                    med.setGenericSource("Zeelabs");
                    med.setSalts(salts);
                    med.setBrandNames(new ArrayList<>());
                    
                    String key = medicineName.toLowerCase();
                    if (!csvMedicineMap.containsKey(key)) {
                        csvMedicineMap.put(key, med);
                        indexBySalts(med, salts);
                        count++;
                    }
                } catch (Exception e) {
                    // Skip problematic lines
                }
            }
            System.out.println("[MedicineService] Zeelabs: " + count + " medicines");
        } catch (Exception e) {
            System.out.println("[MedicineService] Zeelabs CSV error: " + e.getMessage());
        }
    }
    
    /**
     * Parse CSV line handling quoted fields with commas
     */
    private static String[] parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();
        
        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString());
        return result.toArray(new String[0]);
    }
    
    /**
     * Extract salt compositions from medicine name
     * e.g., "Ibuprofen 400mg and Paracetamol 325mg Tablets IP" -> ["ibuprofen", "paracetamol"]
     */
    private static List<String> extractSaltsFromName(String name) {
        List<String> salts = new ArrayList<>();
        if (name == null || name.isEmpty()) return salts;
        
        String cleanName = name.toLowerCase();
        
        // Remove common suffixes
        cleanName = cleanName.replaceAll("(?i)(tablets?|capsules?|injection|syrup|oral suspension|oral solution|" +
                "cream|gel|ointment|lotion|drops|powder|granules|" +
                "ip|bp|usp|nfi|" +
                "\\d+'s|\\d+\\s*ml|\\d+\\s*gm?|\\d+\\s*mg|\\d+\\s*mcg|\\d+\\s*%|" +
                "per\\s*\\d+\\s*ml|strip|bottle|vial|tube|jar|ampoule|" +
                "sr|er|cr|pr|xr|dr|mr|tr|la|xl|" +
                "dispersible|chewable|effervescent|enteric.?coated|gastro.?resistant|" +
                "prolonged.?release|sustained.?release|extended.?release|modified.?release|" +
                "intravenous|intramuscular|subcutaneous|topical|" +
                "paediatric|pediatric|forte|plus|extra)\\s*", " ");
        
        // Split by common separators
        String[] parts = cleanName.split("(?i)(\\s+and\\s+|\\s*\\+\\s*|\\s*&\\s*|\\s*/\\s*|\\s*with\\s*)");
        
        for (String part : parts) {
            // Clean up each part
            String salt = part.trim()
                    .replaceAll("\\d+", "")  // Remove numbers
                    .replaceAll("[^a-z\\s]", "") // Keep only letters and spaces
                    .replaceAll("\\s+", " ")
                    .trim();
            
            // Only add if it's a valid salt name (not too short, not just common words)
            if (salt.length() >= 3 && !isCommonWord(salt)) {
                salts.add(salt);
            }
        }
        
        return salts;
    }
    
    /**
     * Check if word is a common non-salt word
     */
    private static boolean isCommonWord(String word) {
        Set<String> commonWords = Set.of(
            "tab", "cap", "inj", "syr", "sol", "susp", "cream", "gel", "lot",
            "oral", "topical", "for", "the", "with", "from", "use", "only",
            "new", "old", "dry", "wet", "hot", "cold", "soft", "hard"
        );
        return commonWords.contains(word.toLowerCase());
    }
    
    /**
     * Index medicine by its salts for faster lookup
     */
    private static void indexBySalts(Medicine med, List<String> salts) {
        if (salts == null || salts.isEmpty()) return;
        
        // Create salt key (sorted for consistency)
        List<String> sortedSalts = new ArrayList<>(salts);
        Collections.sort(sortedSalts);
        String saltKey = String.join("+", sortedSalts);
        
        saltToMedicinesMap.computeIfAbsent(saltKey, k -> new ArrayList<>()).add(med);
        
        // Also index individual salts for single-salt searches
        for (String salt : salts) {
            saltToMedicinesMap.computeIfAbsent(salt, k -> new ArrayList<>()).add(med);
        }
    }
    
    /**
     * Search medicines by salt composition (used by GenericFinderService)
     * Filters out medicines with ₹0 price (out of stock/unavailable)
     * For topical salts (methyl salicylate, menthol), only returns gel/spray/cream
     */
    public static List<Medicine> findBySalts(List<String> searchSalts) {
        if (searchSalts == null || searchSalts.isEmpty()) return Collections.emptyList();
        
        List<String> normalizedSalts = searchSalts.stream()
            .map(s -> s.toLowerCase().trim())
            .filter(s -> s.length() >= 3)
            .collect(Collectors.toList());
        
        if (normalizedSalts.isEmpty()) return Collections.emptyList();
        
        List<Medicine> results = new ArrayList<>();
        boolean isSingleSalt = normalizedSalts.size() == 1;
        
        // Check if this is a topical product search (contains topical-specific salts)
        boolean isTopicalSearch = normalizedSalts.stream()
            .anyMatch(s -> s.contains("methyl salicylate") || s.contains("menthol") || 
                          s.contains("linseed") || s.contains("camphor"));
        
        System.out.println("[MedicineService] 🔍 Searching for salts: " + normalizedSalts + 
            " (single=" + isSingleSalt + ", topical=" + isTopicalSearch + ")");
        
        for (Medicine med : csvMedicineMap.values()) {
            // Skip medicines with ₹0 price (out of stock/unavailable)
            if (med.getPrice() <= 0) {
                continue;
            }
            
            String medName = med.getName().toLowerCase();
            List<String> medSalts = med.getSalts();
            
            // For topical searches, only match gel/spray/cream/ointment/lotion
            if (isTopicalSearch) {
                boolean isTopicalForm = medName.contains("gel") || medName.contains("spray") || 
                    medName.contains("cream") || medName.contains("ointment") || 
                    medName.contains("lotion") || medName.contains("balm");
                if (!isTopicalForm) {
                    continue; // Skip non-topical forms
                }
            }
            
            if (isSingleSalt) {
                // For single salt: Check both extracted salts AND medicine name
                String searchSalt = normalizedSalts.get(0);
                
                // Check extracted salts
                boolean saltMatch = medSalts != null && medSalts.size() == 1 && 
                    medSalts.get(0).toLowerCase().contains(searchSalt);
                
                // Also check medicine name starts with salt (pure medicine)
                boolean nameMatch = medName.startsWith(searchSalt) && 
                    !medName.contains(" and ") && 
                    !medName.contains("+") &&
                    !medName.contains("&");
                
                if (saltMatch || nameMatch) {
                    results.add(med);
                }
            } else {
                // For multiple salts: Check if MAJORITY of search salts are in medicine name
                int matchCount = 0;
                for (String searchSalt : normalizedSalts) {
                    // Check each word of the salt separately
                    String[] saltWords = searchSalt.split("\\s+");
                    for (String word : saltWords) {
                        if (word.length() >= 4 && medName.contains(word)) {
                            matchCount++;
                            break;
                        }
                    }
                }
                
                // At least 2 salts should match for combination
                if (matchCount >= 2) {
                    System.out.println("[MedicineService] ✅ Match (" + matchCount + "/" + normalizedSalts.size() + "): " + med.getName());
                    results.add(med);
                }
            }
        }
        
        System.out.println("[MedicineService] 📊 Found " + results.size() + " matches");
        return results;
    }
    
    // Helper method to extract salts from medicine name (for legacy compatibility)
    private static List<String> parseSaltsFromName(String name) {
        return extractSaltsFromName(name);
    }
            /**
             * Main workflow: Given a brand/private medicine name, find its generic(s), suggest generic(s) with price,
             * update brandNames array, and handle scraping fallback and combinations.
             */
    public List<Medicine> suggestGenericForBrand(String brandName) {
        List<Medicine> result = new ArrayList<>();
        // 1. Search in CSV in-memory map for generics containing this brand
        for (Medicine med : csvMedicineMap.values()) {
            if (med.getBrandNames() != null && med.getBrandNames().stream().anyMatch(b -> b.equalsIgnoreCase(brandName))) {
                result.add(med);
            }
        }
        if (!result.isEmpty()) return result;

        // 2. Search in DB if not found in CSV
        List<Medicine> genericsWithBrand = medicineRepository.findAll().stream()
            .filter(med -> med.getBrandNames() != null && med.getBrandNames().stream().anyMatch(b -> b.equalsIgnoreCase(brandName)))
            .collect(Collectors.toList());
        if (!genericsWithBrand.isEmpty()) {
            result.addAll(genericsWithBrand);
            return result;
        }

        // 3. Scrape generic(s) if not found in CSV/DB
        List<String> scrapedGenerics = scraperService.getSaltForMedicine(brandName);
        if (scrapedGenerics == null || scrapedGenerics.isEmpty()) {
            // Not found by scraping either
            return result;
        }
        for (String generic : scrapedGenerics) {
            result.add(new Medicine(generic, List.of(generic + " scraped"), 0.0, false));
        }
        return result;
            }
    
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private ScraperService scraperService;

    public List<Medicine> searchMedicines(String query) {
        // Fuzzy search
        List<Medicine> results = new ArrayList<>();
        // Search in medicines collection
        List<Medicine> found = medicineRepository.findByNameFuzzy(query);
        if (!found.isEmpty()) {
            Medicine med = found.get(0);
            double scrapedPrice = scraperService.getPriceForMedicine(med.getName());
            if (scrapedPrice != med.getPrice() && scrapedPrice > 0) {
                med.setPrice(scrapedPrice);
                medicineRepository.save(med);
            }
            results.add(med);
        }
        // Search in generic_medicine collection
      
        // If nothing found, only then scrape and store in DB
        if (results.isEmpty()) {
            System.out.println("[MedicineService] SCRAPING medicine: " + query);
            Medicine scraped = scrapeAndAddMedicine(query);
            if (scraped != null) {
                medicineRepository.save(scraped);
                results.add(scraped);
            }
        }
        // Always return DB value, never re-scrape if already present
        return results;
    }

    public Medicine scrapeAndAddMedicine(String name) {
        List<String> salts = scraperService.getSaltForMedicine(name);
        if (salts == null || salts.isEmpty()) return null;
        Medicine newMed = new Medicine(name, salts, scraperService.getPriceForMedicine(name), true);
        medicineRepository.save(newMed);
        return newMed;
    }

    public List<Medicine> getAlternatives(String brandName) {
        // 1. Find generic alternatives from CSV in-memory map
        List<Medicine> alternatives = csvMedicineMap.values().stream()
            .filter(med -> med.getBrandNames() != null && med.getBrandNames().stream().anyMatch(b -> b.equalsIgnoreCase(brandName)))
            .collect(Collectors.toList());
        // 2. If not found in CSV, fallback to DB
        if (alternatives.isEmpty()) {
            Medicine brand = medicineRepository.findByNameIgnoreCase(brandName);
            if (brand == null) return Collections.emptyList();
            alternatives = medicineRepository.findBySaltsIn(brand.getSalts());
            if (alternatives.stream().noneMatch(m -> m.getName().equalsIgnoreCase(brand.getName()))) {
                alternatives.add(brand);
            }
        }
        // Sort all by price (cheapest first)
        List<Medicine> sorted = alternatives.stream()
            .sorted(Comparator.comparing(Medicine::getPrice))
            .collect(Collectors.toList());
        return sorted;
    }

    public long deleteMedicineByName(String name) {
        return medicineRepository.deleteByNameIgnoreCase(name);
    }

    public void deleteMontairLC() {
        medicineRepository.deleteByNameIgnoreCase("Montair LC");
    }
}
