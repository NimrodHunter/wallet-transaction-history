const app = require("./app");
const supertest = require("supertest");
const ganache = require("ganache-cli");
const ethers = require("ethers");

const testTimeout = 10000;

describe("Api", () => {
  const server = ganache.server();
  const request = supertest(app.api);
  let accounts;
  const provider = app.blockchainProvider;

  beforeAll(done => {
    server.listen(8686, () => {
      accounts = Object.values(server.provider.manager.state.accounts);
      done();
    });
  });

  beforeEach(async () => {
    await app.dbProvider.setup(true);
  });

  describe("[POST] /hash", () => {
    it("should be protected by token", async () => {
      const payload = {
        userId: 2,
        hash:
          "0xb4387d1f1ff25800abab2e5c6c2978b43e63573b27c66d77f28fb10fd0d0fff3",
      };

      const response = await request.post("/hash").send(payload);
      const expectedStatusCode = 400;
      const expectedErrorMessage = "Invalid token";

      expect(response.status).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });

    it(
      "should store a hash",
      async () => {
        const payload = {
          userId: 2,
          hash:
            "0xb4387d1f1ff25800abab2e5c6c2978b43e63573b27c66d77f28fb10fd0d0fff3",
        };

        const response = await request
          .post("/hash")
          .send(payload)
          .set(app.config.security.token.name, app.config.security.token.value);

        const expectedStatusCode = 201;

        expect(response.status).toBe(expectedStatusCode);
        expect(response.body).toHaveProperty("success");
        expect(response.body.success).toBe(true);
      },
      testTimeout
    );
  });

  describe("[GET] /user/txs/:userId", () => {
    const userId = 3;
    let hash;

    beforeEach(async () => {
      const sender = accounts[1];
      const receiver = accounts[2];
      const transaction = {
        from: sender.address,
        to: receiver.address,
        value: 1,
      };

      const wallet = new ethers.Wallet(sender.secretKey);
      const fullTx = await provider.setupTransaction(transaction);
      fullTx.gasLimit = fullTx.gas;
      const signedTx = wallet.sign(fullTx);
      const signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
      hash = await provider.sendTransaction(signedTxBuffer);
      await provider.waitTxToBeMined(hash);

      const payload = {
        userId,
        hash,
      };
      await request
        .post("/hash")
        .send(payload)
        .set(app.config.security.token.name, app.config.security.token.value);
    });

    it("should be protected by token", async () => {
      const response = await request.get(`/user/txs/${userId}`);
      const expectedStatusCode = 400;
      const expectedErrorMessage = "Invalid token";

      expect(response.status).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });

    it("should return the list of transactions belong to an user", async () => {
      const response = await request
        .get(`/user/txs/${userId}`)
        .set(app.config.security.token.name, app.config.security.token.value);

      const expectedStatusCode = 200;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("txs");
      expect(response.body.txs).toHaveLength(1);
      expect(response.body.txs[0].hash).toBe(hash);
    });
  });

  describe("[GET] /user/custom/txs/:userId/:key/:value", () => {
    const userId = 4;
    const hashes = [];
    const minedTxs = [];
    let receiver;

    beforeEach(async () => {
      const sender = accounts[1];
      receiver = accounts[2];
      const transaction = {
        from: sender.address,
        to: receiver.address,
        value: 1,
      };
      const wallet = new ethers.Wallet(sender.secretKey);
      let fullTx = await provider.setupTransaction(transaction);
      fullTx.gasLimit = fullTx.gas;
      let signedTx = wallet.sign(fullTx);
      let signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
      hashes.push(await provider.sendTransaction(signedTxBuffer));
      minedTxs.push(await provider.waitTxToBeMined(hashes[0]));
      await request
        .post("/hash")
        .send({ userId, hash: hashes[0] })
        .set(app.config.security.token.name, app.config.security.token.value);
      fullTx = await provider.setupTransaction(transaction);
      fullTx.gasLimit = fullTx.gas;
      signedTx = wallet.sign(fullTx);
      signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
      hashes.push(await provider.sendTransaction(signedTxBuffer));
      minedTxs.push(await provider.waitTxToBeMined(hashes[1]));
      await request
        .post("/hash")
        .send({ userId, hash: hashes[1] })
        .set(app.config.security.token.name, app.config.security.token.value);
      fullTx = await provider.setupTransaction(transaction);
      fullTx.gasLimit = fullTx.gas;
      signedTx = wallet.sign(fullTx);
      signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
      hashes.push(await provider.sendTransaction(signedTxBuffer));
      minedTxs.push(await provider.waitTxToBeMined(hashes[2]));
      await request
        .post("/hash")
        .send({ userId, hash: hashes[2] })
        .set(app.config.security.token.name, app.config.security.token.value);
    });

    it("should be protected by token", async () => {
      const key = "to";
      const value = receiver.address;

      const response = await request.get(
        `/user/custom/txs/${userId}/${key}/${value}`
      );
      const expectedStatusCode = 400;
      const expectedErrorMessage = "Invalid token";

      expect(response.status).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });

    it("should return the list of transactions belong to an user filter by a key value parameter", async () => {
      const key = "to";
      const value = receiver.address;
      const response = await request
        .get(`/user/custom/txs/${userId}/${key}/${value}`)
        .set(app.config.security.token.name, app.config.security.token.value);

      const expectedStatusCode = 200;
      expect(response.status).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("txs");
      expect(response.body.txs).toHaveLength(3);

      let counter = 0;

      response.body.txs.forEach(tx => {
        expect(tx.to).toBe(minedTxs[counter].to);
        counter += 1;
      });
    });
  });
});
