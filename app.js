// require("events").EventEmitter.defaultMaxListeners = 100;

require("express-async-errors");
require("dotenv").config();

const express = require("express");

const { initSocketConnection, app, server } = require("./server");

app.set("trust proxy", 1);

const { db, trackRedis } = require("./db");

const expressLayouts = require("express-ejs-layouts");

const {
      authRouter,
      usersRouter,
      genericRouter,
      apiRouter,
      chatRouter,
} = require("./routes");
const {
      errorHandlerMiddleware,
      notFoundMiddleware,
      sessionMiddleware,
      requestMiddleware,
      csrfProtection,
      methodOverrideMiddleware,
} = require("./middlewares");

// ================>

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverrideMiddleware);

// security
app.disable("x-powered-by");

app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/index"); // default layout

app.use(sessionMiddleware);

/* **************************** */

app.use(requestMiddleware, csrfProtection);

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/users", usersRouter);
app.use("/chat", chatRouter);
app.use("/", genericRouter);

app.use(notFoundMiddleware, errorHandlerMiddleware);

/* **************************** */
process.setMaxListeners(0);

/*

const { networkInterfaces } = require("os");

const nets = networkInterfaces();
const results = Object.create(null);

for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
                  if (!results[name]) {
                        results[name] = [];
                  }
                  results[name].push(net.address);
            }
      }
}

console.log(results);

*/

let start = async (port = process.env.PORT || 3000) => {
      try {
            await db.connect();

            await trackRedis();

            server.listen(port, () => {
                  console.log(
                        `Listening on : ${port}, visit http://localhost:${port} && http://192.168.0.198:${port}`
                  );
            });

            initSocketConnection();
      } catch (err) {
            console.log(err);
            process.exit(1);
      }
};

start();
