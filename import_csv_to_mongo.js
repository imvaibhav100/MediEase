const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'pharmacydb';
const collectionName = 'medicines';
const csvFilePath = './MeduEase_master_database (1).csv';

async function importCSV() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const genericMap = {};
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Use correct column names from your CSV
      const genericName = row['GenericName']?.trim();
      const genericPrice = parseFloat(row['GenericPrice']);
      const genericSource = row['GenericSource']?.trim();
      const brandName = row['BrandName']?.trim();
      if (genericName && !isNaN(genericPrice) && genericSource && brandName) {
        const key = `${genericName}|${genericSource}`;
        if (!genericMap[key]) {
          genericMap[key] = {
            genericName,
            genericPrice,
            genericSource,
            brandNames: []
          };
        }
        genericMap[key].brandNames.push(brandName);
      }
    })
    .on('end', async () => {
      const medicines = Object.values(genericMap);
      if (medicines.length > 0) {
        await collection.deleteMany({}); // Optional: clear old data
        await collection.insertMany(medicines);
        console.log('Medicines imported:', medicines.length);
      } else {
        console.log('No valid medicines found in CSV.');
      }
      await client.close();
    });
}

importCSV();
