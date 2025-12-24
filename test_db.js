const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('pharmacydb');
    
    console.log('=== Testing MongoDB Search ===\n');
    
    // Check total count
    const total = await db.collection('medicines').countDocuments();
    console.log('Total medicines in DB:', total);
    
    // Search for calcium
    console.log('\n--- Searching for "calcium" in salts ---');
    const calciumMeds = await db.collection('medicines').find({
        salts: { $elemMatch: { $regex: 'calcium', $options: 'i' } }
    }).limit(10).toArray();
    
    console.log('Found:', calciumMeds.length, 'medicines with calcium');
    calciumMeds.forEach(m => {
        console.log('  -', m.name);
        console.log('    Salts:', m.salts);
        console.log('    Price:', m.price);
    });
    
    // Search for vitamin d3
    console.log('\n--- Searching for "vitamin" in salts ---');
    const vitaminMeds = await db.collection('medicines').find({
        salts: { $elemMatch: { $regex: 'vitamin', $options: 'i' } }
    }).limit(10).toArray();
    
    console.log('Found:', vitaminMeds.length, 'medicines with vitamin');
    vitaminMeds.forEach(m => {
        console.log('  -', m.name);
        console.log('    Salts:', m.salts);
    });
    
    // Check a sample document structure
    console.log('\n--- Sample document structure ---');
    const sample = await db.collection('medicines').findOne({});
    console.log(JSON.stringify(sample, null, 2));
    
    await client.close();
}

test().catch(console.error);
