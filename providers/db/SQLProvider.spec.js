const SQLProvider = require("./SQLProvider");

describe("SQLProvider", () => {
  const db = new SQLProvider(null, null, null, {
    dialect: "sqlite",
    logging: false,
  });

  beforeEach(async () => {
    await db.setup(true);
  });

  test("It can store a hash", async () => {
    const userId = 1;
    const expectedHashtId = 1;
    const msgHash =
      "0xb4387d1f1ff25800abab2e5c6c2978b43e63573b27c66d77f28fb10fd0d0fff3";
    const hash = await db.storeHash(userId, msgHash);
    expect(hash.id).toBe(expectedHashtId);
    expect(hash.userId).toBe(userId);
  });

  test("It can retrieve the hashes using the user id", async () => {
    const userId = 1;
    const msgHash = [];
    msgHash.push(
      "0xb4387d1f1ff25800abab2e5c6c2978b43e63573b27c66d77f28fb10fd0d0fff3"
    );
    await db.storeHash(userId, msgHash[0]);
    msgHash.push(
      "0x5a6365c064e20b9f8277ae34ac5d31c155459f33658a9af4c35521380bc96437"
    );
    await db.storeHash(userId, msgHash[1]);
    msgHash.push(
      "0x99367211a5153dde502a4fb5f06c98fe012f0b91db10e9eab8fac89eed3b1e16"
    );
    await db.storeHash(userId, msgHash[2]);

    const hashes = await db.findHashesByUserId(userId);

    hashes.forEach(hash => {
      expect(hash.dataValues.hash).toBe(msgHash[hash.dataValues.id - 1]);
    });
  });
});
