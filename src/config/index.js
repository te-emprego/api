const Config = {
  secret: process.env.SECRET,
  port: process.env.PORT,
  requests: {
    windowMs: 15 * 60 * 1000,
    slowDownDelay: 200,
    slowDownMaxRequests: 400,
    rateLimitRequests: 500,
  },
  mail: {
    sendgrid: process.env.SENDGRID_API,
  },
  db: {
    connectionString: process.env.MONGO_DB,
  },
};

module.exports = Config;
