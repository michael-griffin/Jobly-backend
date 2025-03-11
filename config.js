"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
// Speed up bcrypt during tests, since the algorithm safety isn't being tested
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Use dev database, testing database, or via env var, production database

function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///jobly_test"
      : process.env.DATABASE_URL || "postgresql:///jobly";
}

//If using aiven database, import relevant info from environment variables
//Expects env variables for DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
const fs = require("fs");
function getDatabaseConfigAiven() {
  const user = process.env.DB_USER;  //"avnadmin",
  const password = process.env.DB_PASSWORD;   //CHECK WEBSITE,
  const host = process.env.DB_HOST;  //"pg-jobly-jobly.c.aivencloud.com",
  const port = process.env.DB_PORT;  //"19537",
  const database = process.env.DB_NAME;  //"defaultdb",
  const ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  };

  return {
    user,
    password,
    host,
    port,
    database,
    ssl
  };
}


if (process.env.NODE_ENV !== "test") {
  console.log(`
${"Jobly Config:".green}
${"NODE_ENV:".yellow}           ${process.env.NODE_ENV}
${"SECRET_KEY:".yellow}         ${SECRET_KEY}
${"PORT:".yellow}               ${PORT}
${"BCRYPT_WORK_FACTOR:".yellow} ${BCRYPT_WORK_FACTOR}
${"Database:".yellow}           ${getDatabaseUri()}
---`);
}

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  getDatabaseConfigAiven,
};
