"use strict";

/**
 * March 2025 - switched to Aiven database. This is free, but also can trigger
 * errors regarding a 'self signed certificate'. The fix Aiven suggests is to
 * modify the 'db = new Client(...) command to include additional info/overrides.
 * - This is now done in the new config function getDatabaseConfigAiven.
 * - This requires several new environment variables be set when deploying a backend
 */
const { Client } = require("pg");
const { getDatabaseConfigAiven } = require("./config");
 //mostly unused for aiven db, leaving for logging error messages.
const { getDatabaseUri } = require("./config");
const databaseUri = getDatabaseUri();


//Aiven, requires extra environment variables (see getDatabase func in config)
const config = getDatabaseConfigAiven();
const db = new Client(config);

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
