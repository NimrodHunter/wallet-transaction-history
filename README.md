# Wallet Transaction History API

api to manage users transactions history, you can store the transaction hashes of each user, and ask form them in a custom way.

## Installation

Install dependencies through yarn

`yarn`

## Configuration

Create a environment configuration file `env.yml` like:

```yaml
dev:
  BN_PROVIDER_NAME: '<Blokchain Provider Name>'
  BN_PROVIDER_TOKEN: '<Token Hash>'
  DB_NAME: <Database Name>
  DB_USERNAME: <Database User>
  DB_PASSWORD: <Database Encrypted Password>
  DB_HOST: <Database Host>
  DB_PORT: <Database Port>

prod:
  BN_PROVIDER_NAME: '<Blokchain Provider Name>'
  BN_PROVIDER_TOKEN: '<Token Hash>'
  DB_NAME: <Database Name>
  DB_USERNAME: <Database User>
  DB_PASSWORD: <Database Encrypted Password>
  DB_HOST: <Database Host>
  DB_PORT: <Database Port>
```

## Local server

To start the local server run:

`yarn start`

## Endpoints

### Store Hash

Used to store a ethereum hash.

**URL** : `/hash`

**Method**: `POST`

**Data constrains**
```json
{
    "userId": "[The user identifier]",
    "hash": "[hash to be stored]"
}
```

**Data example**
```json
{
    "userId": 1,
    "hash": "0x7153472d2dea654f9e225f679a4f2833748a5bd9ed3fb0a13d1fe2ed76038d9e"
}

#### Success response

**Code** : `201`

**Content example** :
```json
{
    "success": true
}
```

### Get Transactions

Used to get the whole user transaction history.

**URL** : `/user/txs`

**Method**: `POST`

**Data constrains**
```json
{
    "userId": "[The user identifier]"
}
```

**Data example**
```json
{
    "userId": 1
}
```

#### Success response

**Code** : `200`

**Content example** :
```json
{
    "txs": [
        {
            "hash": "0x41616a45d3abf63ef911b41ef328d59cb752e2a192772e3d197df91a8945c7df",
            "blockHash": "0x6390611c411a5f38817dc134b18f6f1edb58cd1c59ceb001f272d3ea723ffd02",
            "blockNumber": 2370140,
            "transactionIndex": 2,
            "from": "0x31438f7AafE59056BDB4628c8feC791E791cd85b",
            "gasPrice": {
                "_bn": "3b9aca00"
            },
            "gasLimit": {
                "_bn": "5208"
            },
            "to": "0xa5652e6244F673cc20c9fb6BeD1572F62183aC8e",
            "value": {
                "_bn": "1"
            },
            "nonce": 133,
            "data": "0x",
            "r": "0xb6085e64eff6e4786c6e15062d01157cabc37ec44e368d34e2129243b0291ce0",
            "s": "0x41a016f336a566e6915fa4ea9eb9a82c9f61a2e8e1d8ee74e20422d60ff8ebcb",
            "v": 44,
            "creates": null,
            "raw": "0xf8648185843b9aca0082520894a5652e6244f673cc20c9fb6bed1572f62183ac8e01802ca0b6085e64eff6e4786c6e15062d01157cabc37ec44e368d34e2129243b0291ce0a041a016f336a566e6915fa4ea9eb9a82c9f61a2e8e1d8ee74e20422d60ff8ebcb",
            "networkId": 4
        },
        {
            "hash": "0x7153472d2dea654f9e225f679a4f2833748a5bd9ed3fb0a13d1fe2ed76038d9e",
            "blockHash": "0x11954fd1ce803c4730c10db95420de6eb5a387f2ccc706976d4d1d74e9916474",
            "blockNumber": 2370136,
            "transactionIndex": 3,
            "from": "0x31438f7AafE59056BDB4628c8feC791E791cd85b",
            "gasPrice": {
                "_bn": "3b9aca00"
            },
            "gasLimit": {
                "_bn": "5208"
            },
            "to": "0xa5652e6244F673cc20c9fb6BeD1572F62183aC8e",
            "value": {
                "_bn": "1"
            },
            "nonce": 131,
            "data": "0x",
            "r": "0x2e310ff13fa8c128d919eae495a851d83fbe294114f730ac8388d23ea113fb10",
            "s": "0x5311993e2c2c93270a67f6b8690b20c8f2aecfe194133c4991b3b2bdd886dd4f",
            "v": 43,
            "creates": null,
            "raw": "0xf8648183843b9aca0082520894a5652e6244f673cc20c9fb6bed1572f62183ac8e01802ba02e310ff13fa8c128d919eae495a851d83fbe294114f730ac8388d23ea113fb10a05311993e2c2c93270a67f6b8690b20c8f2aecfe194133c4991b3b2bdd886dd4f",
            "networkId": 4
        }
    ]
}
```

### Get Custom transactions

Used to get transaction that match with some key -> value.

**URL** : `/user/txs`

**Method**: `POST`

**Data constrains**
```json
{
    "userId": "[The user identifier]",
    "key": "[key parameter to select]",
    "value": "[value to match]"
}
```

**Data example**
```json
{
    "userId": 1,
    "key": "from",
    "value": "0x59957f77b23e40741ff60311637ac2a3f425b978"
}
```

#### Success response

**Code** : `200`

**Content example** :
```json
{
    "txs": [
        {
            "hash": "0xcc1c96e98a6d89c9dfadf5cdb1dd8d69902673399dc9180168b492756d95211c",
            "blockHash": "0xc08e05a2e4f7bf632afd7a9e1cfad6eecb34c194b823a43d64f40df78fbf471f",
            "blockNumber": 2368621,
            "transactionIndex": 8,
            "from": "0x59957f77b23e40741ff60311637aC2a3f425B978",
            "gasPrice": {
                "_bn": "3b9aca00"
            },
            "gasLimit": {
                "_bn": "5208"
            },
            "to": "0xa5652e6244F673cc20c9fb6BeD1572F62183aC8e",
            "value": {
                "_bn": "1"
            },
            "nonce": 1,
            "data": "0x",
            "r": "0x81531322b1886dc5013d8d845c57da6d59c7c79e32d25275d8f558f4a6e692e2",
            "s": "0x5d4dab6ebb475ca688e0a082d45ffaf9da6946a0aaf8c1180a42f8317b07d480",
            "v": 44,
            "creates": null,
            "raw": "0xf86301843b9aca0082520894a5652e6244f673cc20c9fb6bed1572f62183ac8e01802ca081531322b1886dc5013d8d845c57da6d59c7c79e32d25275d8f558f4a6e692e2a05d4dab6ebb475ca688e0a082d45ffaf9da6946a0aaf8c1180a42f8317b07d480",
            "networkId": 4
        }
    ]
}
```

