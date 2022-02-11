const BlockchainProvider = require("./BlockchainProvider");
const ganache = require("ganache-cli");
const ethers = require("ethers");

describe("BlockchainProvider", () => {
  const server = ganache.server({
    total_accounts: 3,
  });

  let provider;
  let accounts;

  beforeAll(done => {
    server.listen(8545, () => {
      provider = new BlockchainProvider(
        new ethers.providers.JsonRpcProvider("http://localhost:8545")
      );
      accounts = Object.values(server.provider.manager.state.accounts);
      done();
    });
  });

  test("setup transaction", async () => {
    const expectedValue = 1;
    const expectedChainId = 1;
    const expectedNonce = 0;
    const expectedFrom = accounts[0].address;
    const expectedTo = accounts[1].address;

    const transaction = {
      from: expectedFrom,
      to: expectedTo,
      value: expectedValue,
    };

    const fullTx = await provider.setupTransaction(transaction);
    expect(fullTx.chainId).toBe(expectedChainId);
    expect(fullTx.nonce).toBe(expectedNonce);
    expect(fullTx.from).toBe(expectedFrom);
    expect(fullTx.to).toBe(expectedTo);
    expect(parseInt(fullTx.gas)).toBeGreaterThanOrEqual(0);
    expect(parseInt(fullTx.gasPrice)).toBeGreaterThanOrEqual(0);
    expect(parseInt(fullTx.value)).toBe(expectedValue);
  });

  test("It can retrieve the transaction hash when you send a transaction", async () => {
    const sender = accounts[0];
    const receiver = accounts[0];
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
    const hash = await provider.sendTransaction(signedTxBuffer);
    const minedTx = await provider.waitTxToBeMined(hash);

    expect(hash.toLowerCase()).toBe(minedTx.hash.toLowerCase());
  });

  test("It can retrieve the transaction of an user", async () => {
    const sender = accounts[0];
    const receiver = accounts[0];
    const transaction = {
      from: sender.address,
      to: receiver.address,
      value: 1,
    };

    const hashes = [];
    const minedTxs = [];

    const wallet = new ethers.Wallet(sender.secretKey);
    let fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    let signedTx = wallet.sign(fullTx);
    let signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[0]));
    fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    signedTx = wallet.sign(fullTx);
    signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[1]));
    fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    signedTx = wallet.sign(fullTx);
    signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[2]));

    const txs = await provider.transactions(hashes);
    let counter = 0;

    txs.forEach(tx => {
      expect(tx.hash).toBe(minedTxs[counter].hash);
      counter += 1;
    });
  });

  test("It can retrieve the transaction of an user filter for a key value param", async () => {
    const sender = accounts[0];
    const receiver = accounts[0];
    const transaction = {
      from: sender.address,
      to: receiver.address,
      value: 1,
    };

    const hashes = [];
    const minedTxs = [];

    const wallet = new ethers.Wallet(sender.secretKey);
    let fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    let signedTx = wallet.sign(fullTx);
    let signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[0]));
    fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    signedTx = wallet.sign(fullTx);
    signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[1]));
    fullTx = await provider.setupTransaction(transaction);
    fullTx.gasLimit = fullTx.gas;
    signedTx = wallet.sign(fullTx);
    signedTxBuffer = Buffer.from(signedTx.replace("0x", ""), "hex");
    hashes.push(await provider.sendTransaction(signedTxBuffer));
    minedTxs.push(await provider.waitTxToBeMined(hashes[2]));

    const key = "to";
    const value = receiver.address;

    const txs = await provider.transactionsByParam(hashes, key, value);
    let counter = 0;

    txs.forEach(tx => {
      expect(tx.to).toBe(minedTxs[counter].to);
      counter += 1;
    });
  });
});
