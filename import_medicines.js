const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const localUri = 'mongodb://localhost:27017';
const railwayUri = 'mongodb://mongo:FFrgwGPcEDedoeVhNoxSdVGlPAWpDPzX@mongodb.railway.internal:27017';
const uri = process.env.USE_RAILWAY_DB === 'true' ? railwayUri : localUri;
const dbName = 'pharmacydb';
const collectionName = 'medicines';
const csvFilePath = 'Book1.csv';

async function importMedicines() {
  const medicines = [];
  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({ input: fileStream });
  let lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  // Remove the first line (title)
  lines = lines.slice(1);
  // Join remaining lines and parse with csv-parser
  const csvData = lines.join('\n');
  const results = [];
  require('stream').Readable.from(csvData)
    .pipe(csv())
    .on('data', (row) => {
      if (row['Generic Name'] && row['MRP(in Rs.)'] && !isNaN(parseFloat(row['MRP(in Rs.)']))) {
        results.push({
          genericName: row['Generic Name'].trim(),
          price: parseFloat(row['MRP(in Rs.)']),
          brandNames: []
        });
      }
    })
    .on('end', async () => {
      if (results.length === 0) {
        console.error('No valid medicines found. Please check the CSV format.');
        return;
      }
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertMany(results);
        console.log('Medicines imported successfully:', results.length);
      } catch (err) {
        console.error('Error importing medicines:', err);
      } finally {
        await client.close();
      }
    });
}

importMedicines();
