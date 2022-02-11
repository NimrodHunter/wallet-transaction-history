const { createApp } = require("../../api");

const ethers = require("ethers");
require("dotenv").config();

const config = require("../../config");

const BlockchainProvider = require("../../providers/blockchain/BlockchainProvider");
const DBProvider = require("../../providers/db/SQLProvider");

const blockchainProvider = new BlockchainProvider(
  new ethers.providers.JsonRpcProvider("http://localhost:8686")
);

const dbProvider = new DBProvider(null, null, null, {
  dialect: "sqlite",
  logging: false,
});

const api = createApp(blockchainProvider, dbProvider, config);

module.exports = {
  api,
  config,
  blockchainProvider,
  dbProvider,
};
