const Config = {
  secret: process.env.SECRET,
  port: process.env.PORT,
  mail: {
    sendgrid: process.env.SENDGRID_API,
  },
  db: {
    connectionString: process.env.MONGO_DB,
  },
};

module.exports = Config;
