require("dotenv").config();
const session = require("express-session");
let { fromStrToNumTime } = require("../helpers");

const MongoStore = require("connect-mongo");
const { db } = require("../db");

let sessionMiddleware = session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
            mongoUrl: db.mongo_uri,
            ttl: fromStrToNumTime(process.env.SESSION_COOKIE_TTL),
            collectionName: process.env.SESSIONS_COLLECTION_NAME,
      }),
      cookie: {
            secure: false,
            httpOnly: true,
            maxAge: fromStrToNumTime(process.env.SESSION_COOKIE_TTL),
      },
});

module.exports = sessionMiddleware;
