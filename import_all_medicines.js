/**
 * Import All CSV Medicines to MongoDB
 * Run: node import_all_medicines.js
 * 
 * This script imports all 3 CSV files (Jan Aushadhi, Dava India, Zeelabs) 
 * into MongoDB 'medicines' collection
 */

const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'pharmacydb';
const collectionName = 'medicines';

// CSV file paths
const csvFiles = [
    { path: './front/public/Category/Jan Aushadhi.csv', source: 'Jan Aushadhi' },
    { path: './front/public/Category/Dava India.csv', source: 'Dava India' },
    { path: './front/public/Category/Zeelabs.csv', source: 'Zeelabs' }
];

// Parse CSV line handling quoted values
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Extract salt names from generic medicine name
function extractSaltsFromName(name) {
    if (!name) return [];
    
    // Common patterns to remove
    const cleanedName = name
        .replace(/\d+\s*(mg|ml|gm|g|mcg|%|iu|units?)/gi, '') // Remove dosages
        .replace(/\(.*?\)/g, '') // Remove parentheses content
        .replace(/tablets?|capsules?|syrup|injection|oral|solution|suspension|cream|gel|ointment|drops|powder|sachet/gi, '')
        .replace(/ip|bp|usp/gi, '')
        .trim();
    
    // Split by + or & or 'and' or /
    const parts = cleanedName.split(/[+&\/]|(?:\s+and\s+)/i);
    
    const salts = [];
    for (const part of parts) {
        const cleaned = part.trim().toLowerCase();
        if (cleaned && cleaned.length > 2) {
            salts.push(cleaned);
        }
    }
    
    return salts;
}

// Parse Jan Aushadhi CSV
// Format: "Sr No","Drug Code","Generic Name","Unit Size","MRP","Group Name"
function parseJanAushadhi(lines) {
    const medicines = [];
    
    for (let i = 1; i < lines.length; i++) {
        try {
            const parts = parseCSVLine(lines[i]);
            if (parts.length < 5) continue;
            
            const genericName = parts[2].replace(/"/g, '').trim();
            if (!genericName) continue;
            
            let price = 0;
            try {
                price = parseFloat(parts[4].replace(/"/g, '').trim()) || 0;
            } catch (e) {}
            
            const unitSize = parts[3].replace(/"/g, '').trim();
            const salts = extractSaltsFromName(genericName);
            
            medicines.push({
                name: genericName,
                salts: salts,
                price: price,
                brand: false,
                brandNames: [],
                genericSource: 'Jan Aushadhi',
                unitSize: unitSize
            });
        } catch (e) {
            // Skip problematic lines
        }
    }
    
    return medicines;
}

// Parse Dava India CSV
// Format: "Medicine Name","MRP (INR)","Unit Size","Group"
function parseDavaIndia(lines) {
    const medicines = [];
    
    for (let i = 1; i < lines.length; i++) {
        try {
            const parts = parseCSVLine(lines[i]);
            if (parts.length < 3) continue;
            
            const medicineName = parts[0].replace(/"/g, '').trim();
            if (!medicineName) continue;
            
            let price = 0;
            try {
                price = parseFloat(parts[1].replace(/"/g, '').trim()) || 0;
            } catch (e) {}
            
            const unitSize = parts.length > 2 ? parts[2].replace(/"/g, '').trim() : '';
            const salts = extractSaltsFromName(medicineName);
            
            medicines.push({
                name: medicineName + (unitSize ? ' ' + unitSize : ''),
                salts: salts,
                price: price,
                brand: false,
                brandNames: [],
                genericSource: 'Dava India',
                unitSize: unitSize
            });
        } catch (e) {
            // Skip problematic lines
        }
    }
    
    return medicines;
}

// Parse Zeelabs CSV
// Format: Medicine Name,MRP (₹),Unit Size,Group
function parseZeelabs(lines) {
    const medicines = [];
    
    for (let i = 1; i < lines.length; i++) {
        try {
            const parts = parseCSVLine(lines[i]);
            if (parts.length < 3) continue;
            
            const medicineName = parts[0].replace(/"/g, '').trim();
            if (!medicineName) continue;
            
            let price = 0;
            try {
                // Remove ₹ symbol if present
                price = parseFloat(parts[1].replace(/[₹,"]/g, '').trim()) || 0;
            } catch (e) {}
            
            const unitSize = parts.length > 2 ? parts[2].replace(/"/g, '').trim() : '';
            const salts = extractSaltsFromName(medicineName);
            
            medicines.push({
                name: medicineName + (unitSize ? ' ' + unitSize : ''),
                salts: salts,
                price: price,
                brand: false,
                brandNames: [],
                genericSource: 'Zeelabs',
                unitSize: unitSize
            });
        } catch (e) {
            // Skip problematic lines
        }
    }
    
    return medicines;
}

async function importAllMedicines() {
    console.log('🚀 Starting medicine import to MongoDB...\n');
    
    const allMedicines = [];
    
    for (const csvFile of csvFiles) {
        try {
            console.log(`📄 Reading ${csvFile.source}...`);
            
            const content = fs.readFileSync(csvFile.path, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            
            let medicines = [];
            
            if (csvFile.source === 'Jan Aushadhi') {
                medicines = parseJanAushadhi(lines);
            } else if (csvFile.source === 'Dava India') {
                medicines = parseDavaIndia(lines);
            } else if (csvFile.source === 'Zeelabs') {
                medicines = parseZeelabs(lines);
            }
            
            console.log(`   ✅ Parsed ${medicines.length} medicines from ${csvFile.source}`);
            allMedicines.push(...medicines);
            
        } catch (err) {
            console.error(`   ❌ Error reading ${csvFile.path}: ${err.message}`);
        }
    }
    
    console.log(`\n📊 Total medicines to import: ${allMedicines.length}`);
    
    // Remove duplicates by name
    const uniqueMedicines = [];
    const seen = new Set();
    
    for (const med of allMedicines) {
        const key = med.name.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            uniqueMedicines.push(med);
        }
    }
    
    console.log(`📊 Unique medicines (after deduplication): ${uniqueMedicines.length}\n`);
    
    // Connect to MongoDB
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('🔗 Connected to MongoDB');
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Clear existing medicines (optional - uncomment if you want fresh import)
        const deleteResult = await collection.deleteMany({ brand: false });
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing generic medicines`);
        
        // Insert in batches of 500
        const batchSize = 500;
        let inserted = 0;
        
        for (let i = 0; i < uniqueMedicines.length; i += batchSize) {
            const batch = uniqueMedicines.slice(i, i + batchSize);
            await collection.insertMany(batch);
            inserted += batch.length;
            console.log(`   📥 Inserted ${inserted}/${uniqueMedicines.length} medicines...`);
        }
        
        // Create indexes for faster search
        console.log('\n🔧 Creating indexes...');
        await collection.createIndex({ name: 'text' });
        await collection.createIndex({ salts: 1 });
        await collection.createIndex({ genericSource: 1 });
        await collection.createIndex({ name: 1 }, { collation: { locale: 'en', strength: 2 } });
        
        console.log('\n✅ Import complete!');
        console.log(`   Total medicines in database: ${await collection.countDocuments()}`);
        
        // Show sample
        console.log('\n📋 Sample medicines:');
        const samples = await collection.find({}).limit(5).toArray();
        samples.forEach((med, i) => {
            console.log(`   ${i + 1}. ${med.name} - ₹${med.price} (${med.genericSource})`);
            console.log(`      Salts: ${med.salts.join(', ')}`);
        });
        
    } catch (err) {
        console.error('❌ MongoDB error:', err);
    } finally {
        await client.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run the import
importAllMedicines();
