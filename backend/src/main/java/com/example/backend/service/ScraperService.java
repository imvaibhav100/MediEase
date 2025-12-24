package com.example.backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import java.util.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * ScraperService - Web scraping for medicine salt composition
 * Scrapes from 1mg.com to get salt/composition information
 */
@Service
public class ScraperService {
    
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    
    // Cache to avoid repeated scraping
    private final Map<String, List<String>> saltCache = new HashMap<>();
    
    /**
     * Get salt composition by scraping 1mg.com
     */
    public List<String> getSaltForMedicine(String medicineName) {
        if (medicineName == null || medicineName.trim().isEmpty()) {
            return Collections.emptyList();
        }
        
        String normalized = medicineName.trim().toLowerCase();
        
        // Check cache first
        if (saltCache.containsKey(normalized)) {
            System.out.println("[ScraperService] Cache hit for: " + medicineName);
            return saltCache.get(normalized);
        }
        
        try {
            List<String> salts = scrapeFrom1mg(medicineName);
            if (!salts.isEmpty()) {
                saltCache.put(normalized, salts);
                return salts;
            }
            
            // Try alternative: scrape from 1mg search
            salts = scrapeFrom1mgSearch(medicineName);
            if (!salts.isEmpty()) {
                saltCache.put(normalized, salts);
                return salts;
            }
            
        } catch (Exception e) {
            System.err.println("[ScraperService] Error scraping for: " + medicineName + " - " + e.getMessage());
        }
        
        return Collections.emptyList();
    }
    
    /**
     * Scrape salt from 1mg product search
     */
    private List<String> scrapeFrom1mg(String medicineName) {
        try {
            String searchUrl = "https://www.1mg.com/search/all?name=" + URLEncoder.encode(medicineName, StandardCharsets.UTF_8);
            System.out.println("[ScraperService] Scraping: " + searchUrl);
            
            Document doc = Jsoup.connect(searchUrl)
                    .userAgent(USER_AGENT)
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5")
                    .timeout(10000)
                    .get();
            
            // Find the first product link
            Elements productLinks = doc.select("a[href*='/drugs/']");
            if (productLinks.isEmpty()) {
                productLinks = doc.select("a[href*='/otc/']");
            }
            
            if (!productLinks.isEmpty()) {
                String productUrl = productLinks.first().absUrl("href");
                return scrapeProductPage(productUrl);
            }
            
        } catch (Exception e) {
            System.err.println("[ScraperService] 1mg search error: " + e.getMessage());
        }
        
        return Collections.emptyList();
    }
    
    /**
     * Scrape from 1mg search API/page
     */
    private List<String> scrapeFrom1mgSearch(String medicineName) {
        try {
            // Try direct search results page
            String searchUrl = "https://www.1mg.com/search/all?name=" + URLEncoder.encode(medicineName, StandardCharsets.UTF_8);
            
            Document doc = Jsoup.connect(searchUrl)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();
            
            // Look for salt info in search results
            Elements saltElements = doc.select(".style__salt-name___2-dJB, .style__drug-composition___Om7nH, [class*='salt'], [class*='composition']");
            
            if (!saltElements.isEmpty()) {
                String saltText = saltElements.first().text();
                return parseSaltString(saltText);
            }
            
            // Try finding in product cards
            Elements productCards = doc.select(".style__horizontal-card___1Cwgh, .style__product-card___2Xqfb, [class*='product-card']");
            for (Element card : productCards) {
                String cardText = card.text().toLowerCase();
                if (cardText.contains(medicineName.toLowerCase())) {
                    Elements composition = card.select("[class*='composition'], [class*='salt']");
                    if (!composition.isEmpty()) {
                        return parseSaltString(composition.first().text());
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("[ScraperService] 1mg search API error: " + e.getMessage());
        }
        
        return Collections.emptyList();
    }
    
    /**
     * Scrape a specific 1mg product page for salt composition
     */
    private List<String> scrapeProductPage(String productUrl) {
        try {
            System.out.println("[ScraperService] Scraping product page: " + productUrl);
            
            Document doc = Jsoup.connect(productUrl)
                    .userAgent(USER_AGENT)
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .timeout(10000)
                    .get();
            
            // Try multiple selectors for salt composition
            String[] selectors = {
                ".saltInfo a",
                ".DrugHeader__meta-value___vqYM0",
                "[class*='salt-name']",
                "[class*='composition']",
                ".DrugHeader__meta___2PaEG",
                "a[href*='/generics/']",
                ".style__meta-value___1bKxu"
            };
            
            for (String selector : selectors) {
                Elements elements = doc.select(selector);
                for (Element el : elements) {
                    String text = el.text().trim();
                    if (!text.isEmpty() && !text.equalsIgnoreCase("salt") && text.length() > 2) {
                        List<String> salts = parseSaltString(text);
                        if (!salts.isEmpty()) {
                            System.out.println("[ScraperService] Found salts: " + salts);
                            return salts;
                        }
                    }
                }
            }
            
            // Fallback: search in page content for common patterns
            String pageText = doc.text();
            
            // Look for patterns like "Contains: Paracetamol" or "Composition: Ibuprofen + Paracetamol"
            String[] patterns = {"composition:", "contains:", "salt:", "active ingredient:"};
            for (String pattern : patterns) {
                int idx = pageText.toLowerCase().indexOf(pattern);
                if (idx != -1) {
                    String after = pageText.substring(idx + pattern.length(), Math.min(idx + pattern.length() + 100, pageText.length()));
                    String saltPart = after.split("[\\n\\r]")[0].trim();
                    if (!saltPart.isEmpty()) {
                        List<String> salts = parseSaltString(saltPart);
                        if (!salts.isEmpty()) {
                            return salts;
                        }
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("[ScraperService] Product page error: " + e.getMessage());
        }
        
        return Collections.emptyList();
    }
    
    /**
     * Parse salt string into list
     * Handles formats like: "Paracetamol (500mg) + Ibuprofen (400mg)"
     */
    private List<String> parseSaltString(String saltString) {
        if (saltString == null || saltString.trim().isEmpty()) {
            return Collections.emptyList();
        }
        
        List<String> salts = new ArrayList<>();
        
        // Split by + or ,
        String[] parts = saltString.split("[+,]");
        
        for (String part : parts) {
            // Remove dosage like (500mg), (400 mg), 500mg etc
            String cleaned = part.replaceAll("\\([^)]*\\)", "")
                               .replaceAll("\\d+\\s*(mg|ml|gm|mcg|iu)", "")
                               .replaceAll("[^a-zA-Z\\s-]", "")
                               .trim();
            
            // Capitalize first letter
            if (!cleaned.isEmpty() && cleaned.length() > 2) {
                cleaned = cleaned.substring(0, 1).toUpperCase() + cleaned.substring(1).toLowerCase();
                if (!salts.contains(cleaned)) {
                    salts.add(cleaned);
                }
            }
        }
        
        return salts;
    }
    
    /**
     * Clear the cache
     */
    public void clearCache() {
        saltCache.clear();
    }
    
    /**
     * Get price for medicine - returns 0 (use CSV data instead)
     * This method is kept for backwards compatibility
     */
    public double getPriceForMedicine(String name) {
        // We don't scrape prices - use CSV data from the database
        return 0.0;
    }
}
