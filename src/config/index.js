const Config = {
  secret: process.env.SECRET,
  port: process.env.PORT,
  db: {
    connectionString: process.env.MONGO_DB,
  },
};

module.exports = Config;
