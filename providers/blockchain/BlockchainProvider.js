const ethers = require("ethers");

class BlockchainProvider {
  constructor(provider) {
    this.provider = provider;
  }

  async setupTransaction(transaction) {
    const chainId = this.provider.chainId;

    let tx = transaction;

    if (tx.gasPrice === undefined) {
      const gasPrice = await this.provider.getGasPrice();
      tx.gasPrice = gasPrice.toHexString();
    }

    if (tx.gas === undefined) {
      const gas = await this.provider.estimateGas(tx);
      tx.gas = gas.toHexString();
    }

    if (tx.value) {
      const valueBN = ethers.utils.bigNumberify(tx.value);
      tx.value = valueBN.toHexString();
    }

    const nonce = await this.provider.getTransactionCount(tx.from);

    tx = {
      ...tx,
      nonce,
      chainId,
    };

    return tx;
  }

  sendTransaction(signedTx) {
    return this.provider.sendTransaction(`0x${signedTx.toString("hex")}`);
  }

  async transactionsByParam(hashes, key, value) {
    let result = [];
    const promises = [];
    hashes.forEach(hash => {
      promises.push(this.provider.getTransaction(hash));
    });
    const txs = await Promise.all(promises);
    result = txs.filter(tx => {
      if (typeof tx[key] === "string") {
        return tx[key].toLowerCase() === value.toLowerCase();
      }
      return tx[key] === value;
    });
    return result;
  }

  async transactions(hashes) {
    const promises = [];
    hashes.forEach(hash => {
      promises.push(this.provider.getTransaction(hash));
    });
    const txs = await Promise.all(promises);
    return txs;
  }

  waitTxToBeMined(hash) {
    return this.provider.waitForTransaction(hash);
  }
}

module.exports = BlockchainProvider;
