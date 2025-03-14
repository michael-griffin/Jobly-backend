"use strict";

const fs = require("fs");
const { Client } = require("pg");
const { getDatabaseConfigAiven } = require("./config");
 //mostly unused for aiven db, leaving for logging error messages.
const { getDatabaseUri } = require("./config");
const databaseUri = getDatabaseUri();

const db = new Client({
  connectionString: databaseUri,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
});


//Aiven, with extra environment variables
// const config = getDatabaseConfigAiven();
// const db = new Client(config);

//Original, non Aiven
// const db = new Client({
//   connectionString: databaseUri,
// });

async function connectDb() {
  // Jest replaces console.* with custom methods; get the real ones for this
  const { log, error } = require("console");
  try {
    await db.connect();
    log(`Connected to ${databaseUri}`);
  } catch(err) /* istanbul ignore next (ignore for coverage) */ {
    error(`Couldn't connect to ${databaseUri}`, err.message);
    process.exit(1);
  }
}
connectDb();

module.exports = db;
