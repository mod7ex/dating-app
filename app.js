require("express-async-errors");
require("dotenv").config();

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const DB = require("./db");
const MongoStore = require("connect-mongo");

let session = require("express-session");
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// security
app.disable("x-powered-by");

const expressLayouts = require("express-ejs-layouts");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/index"); // default layout

app.use(
      session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                  mongoUrl: DB.mongo_uri,
                  // ttl: 1000 * 60 * 10,
            }),
            cookie: {
                  secure: false,
                  httpOnly: true,
                  maxAge: 1000 * 60 * 10,
            },
      })
);

/* **************************** */

const { authRouter, usersRouter } = require("./routes");

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
      res.render("home");
});

/* **************************** */

let start = async (port = process.env.PORT || 3000) => {
      const db = new DB();
      await db.connect();

      server.listen(port, () => {
            console.log(
                  `Listening on : ${port}, visit http://localhost:${port}`
            );
      });
};

start();
