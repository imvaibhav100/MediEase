package com.example.backend.repository;

import com.example.backend.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MedicineRepository extends MongoRepository<Medicine, String> {
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Medicine> findByNameFuzzy(String regex);
    
    List<Medicine> findBySaltsIn(List<String> salts);
    
    Medicine findByNameIgnoreCase(String name);
    
    long deleteByNameIgnoreCase(String name);
    
    // Find by exact salt match (all salts must match)
    @Query("{ 'salts': { $all: ?0 }, 'price': { $gt: 0 } }")
    List<Medicine> findBySaltsContainingAll(List<String> salts);
    
    // Find by single salt containing (simple regex on salts array)
    @Query("{ 'salts': { $regex: ?0, $options: 'i' }, 'price': { $gt: 0 } }")
    List<Medicine> findBySaltContaining(String salt);
    
    // Find by salt OR name containing (more flexible search)
    @Query("{ $or: [ { 'salts': { $regex: ?0, $options: 'i' } }, { 'name': { $regex: ?0, $options: 'i' } } ], 'price': { $gt: 0 } }")
    List<Medicine> findBySaltOrNameContaining(String searchTerm);
    
    // Find by generic source
    List<Medicine> findByGenericSource(String source);
    
    // Find all generic medicines (non-branded)
    @Query("{ 'brand': false, 'price': { $gt: 0 } }")
    List<Medicine> findAllGenerics();
    
    // Count by source
    long countByGenericSource(String source);
}
