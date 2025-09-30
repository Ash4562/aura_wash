require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://techsuryatempurl:vMzO4ppsF52tba79@cluster0.0srmr.mongodb.net";
const outputRoot = "G:/mongo_cluster_export";

if (!fs.existsSync(outputRoot)) fs.mkdirSync(outputRoot);

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB cluster");

    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    
    for (let dbInfo of dbs.databases) {
      const dbName = dbInfo.name;
      if (dbName === "admin" || dbName === "local") continue; // skip system DBs

      console.log(`\nProcessing DB: ${dbName}`);
      const dbFolder = path.join(outputRoot, dbName);
      if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);

      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      for (let coll of collections) {
        const colName = coll.name;
        console.log(`  Exporting collection: ${colName}`);
        const data = await db.collection(colName).find({}).toArray();
        fs.writeFileSync(path.join(dbFolder, `${colName}.json`), JSON.stringify(data, null, 2));
      }
    }

    console.log("\n✅ All databases exported successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
