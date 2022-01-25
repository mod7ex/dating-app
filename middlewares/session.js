const session = require("express-session");

const MongoStore = require("connect-mongo");
const { db } = require("../db");

let sessionMiddleware = session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
            mongoUrl: db.mongo_uri,
            ttl: 1000 * 60 * 20,
            collectionName: process.env.SESSIONS_COLLECTION_NAME,
      }),
      cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 20,
      },
});

module.exports = sessionMiddleware;
