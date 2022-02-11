const dotenv = require("dotenv");

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

const SQLProvider = require("../providers/db/SQLProvider");
const DBConfig = require("../config/db");

const pgsql = new SQLProvider(
  DBConfig.database,
  DBConfig.user,
  DBConfig.password,
  {
    host: DBConfig.host,
    port: DBConfig.port,
    dialect: DBConfig.dialect,
  }
);

pgsql
  .setup(true)
  .then(() => {
    console.log("Table created successfully");
    return process.exit(0);
  })
  .catch(error => {
    console.log(error.message);
    return process.exit(1);
  });
