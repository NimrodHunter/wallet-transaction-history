const http = require("serverless-http");
const ethers = require("ethers");
const { createApp } = require("./api");
const config = require("./config");

const BlockchainConfig = config.blockchain;
const DBConfig = config.db;
const BlockchainProvider = require("./providers/blockchain/BlockchainProvider");
const SQLProvider = require("./providers/db/SQLProvider");

const app = createApp(
  new BlockchainProvider(
    new ethers.providers.InfuraProvider(
      BlockchainConfig.provider.name,
      BlockchainConfig.provider.token
    )
  ),
  new SQLProvider(DBConfig.database, DBConfig.user, DBConfig.password, {
    host: DBConfig.host,
    port: DBConfig.port,
    dialect: DBConfig.dialect,
  }),
  config
);

module.exports.api = http(app);
