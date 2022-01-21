const session = require("express-session");

const MongoStore = require("connect-mongo");
const DB = require("../db");

let sessionMiddleware = session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
            mongoUrl: DB.mongo_uri,
            ttl: 1000 * 60 * 10 * 1000,
            collectionName: process.env.SESSIONS_COLLECTION_NAME,
      }),
      cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 10 * 1000,
      },
});

module.exports = sessionMiddleware;
