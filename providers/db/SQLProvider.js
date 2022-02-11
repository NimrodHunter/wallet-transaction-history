const Sequelize = require("sequelize");

const HashSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hash: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: { isLowercase: true, is: /^0x[0-9a-fA-F]{64}$/i },
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

class PostgreSQLProvider {
  constructor(database, username, password, options) {
    this.manager = new Sequelize(database, username, password, options);
    this.hash = this.manager.define("hash", HashSchema);
  }

  async storeHash(userId, hash) {
    const hashObject = await this.hash.create({
      hash: hash.toLowerCase(),
      userId,
    });

    return hashObject;
  }

  async findHashesByUserId(userId) {
    const hashes = await this.hash.findAll({
      where: { userId },
    });

    return hashes;
  }

  async setup(force = false) {
    await this.manager.authenticate();
    await this.hash.sync({ force });
  }
}

module.exports = PostgreSQLProvider;
