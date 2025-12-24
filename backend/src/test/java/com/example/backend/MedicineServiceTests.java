package com.example.backend;

import com.example.backend.model.Medicine;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.service.MedicineService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import java.util.List;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class MedicineServiceTests {
    @Autowired
    private MedicineService medicineService;
    @Autowired
    private MedicineRepository medicineRepository;

    @Test
    public void testFuzzySearchAndAutoGrowth() {
        // Clear all medicines to avoid interference from previous tests
        medicineRepository.deleteAll();
        // Search for Crocin (should auto-add if not present)
        List<Medicine> result = medicineService.searchMedicines("Crocin");
        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals("Crocin", result.get(0).getName());
        Assertions.assertTrue(result.get(0).getSalts().contains("Paracetamol"));
    }

    @Test
    public void testAlternativesLogic() {
        // Clear all medicines to avoid interference from auto-growth or previous tests
        medicineRepository.deleteAll();
        // Add two medicines with same salt, different prices
        Medicine med1 = new Medicine("BrandA", List.of("Paracetamol"), 50.0, true);
        Medicine med2 = new Medicine("GenericA", List.of("Paracetamol"), 20.0, false);
        medicineRepository.save(med1);
        medicineRepository.save(med2);
        List<Medicine> alternatives = medicineService.getAlternatives("BrandA");
        Assertions.assertFalse(alternatives.isEmpty());
        Assertions.assertEquals("GenericA", alternatives.get(0).getName()); // Cheapest first
    }

    @Test
    public void testEdgeCaseCombination() {
        // Clear all medicines to avoid interference from previous tests
        medicineRepository.deleteAll();
        // Search for Sinarest (combination)
        List<Medicine> result = medicineService.searchMedicines("Sinarest");
        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals("Sinarest", result.get(0).getName());
        Assertions.assertTrue(result.get(0).getSalts().contains("Paracetamol"));
        Assertions.assertTrue(result.get(0).getSalts().contains("Phenylephrine"));
    }
}
