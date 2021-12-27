require("express-async-errors");
require("dotenv").config();

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const session = require("express-session");
app.set("trust proxy", 1);

const DB = require("./db");
const MongoStore = require("connect-mongo");

const { authRouter, usersRouter, genericRouter } = require("./routes");
const {
      errorHandlerMiddleware,
      notFoundMiddleware,
      requestMiddleware,
} = require("./middlewares");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const expressLayouts = require("express-ejs-layouts");

// security
app.disable("x-powered-by");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/index"); // default layout

app.use(
      session({
            name: process.env.SESSION_COOKIE_NAME,
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                  mongoUrl: DB.mongo_uri,
                  ttl: 1000 * 60 * 10,
            }),
            cookie: {
                  secure: false,
                  httpOnly: true,
                  maxAge: 1000 * 60 * 10,
            },
      })
);

/* **************************** */

app.use(requestMiddleware);

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/", genericRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

/* **************************** */

let start = async (port = process.env.PORT || 3000) => {
      try {
            const db = new DB();
            await db.connect();

            server.listen(port, () => {
                  console.log(
                        `Listening on : ${port}, visit http://localhost:${port}`
                  );
            });
      } catch (err) {
            console.log(err);
            process.exit(1);
      }
};

start();
