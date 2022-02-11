const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const SecretTokenMiddleware = require("./middlewares/token");

module.exports.createApp = (blockchainProvider, dbProvider, config) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json({ extended: true }));

  app.use(
    SecretTokenMiddleware(
      config.security.token.name,
      config.security.token.value
    )
  );

  app.get("/user/custom/txs/:userId/:key/:value", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      let hashes = await dbProvider.findHashesByUserId(userId);
      hashes = hashes.map(hash => hash.hash);
      const txs = await blockchainProvider.transactionsByParam(
        hashes,
        req.params.key,
        req.params.value
      );

      res.json({
        txs,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/user/txs/:userId", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      let hashes = await dbProvider.findHashesByUserId(userId);
      hashes = hashes.map(hash => hash.hash);
      const txs = await blockchainProvider.transactions(hashes);

      res.json({
        txs,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/hash", async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const hash = req.body.hash;

      await dbProvider.storeHash(userId, hash);

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, req, res, next) => {
    const statusCode = 400;

    res.status(statusCode).json({
      error: err.message,
    });
  });

  return app;
};
