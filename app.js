// require("events").EventEmitter.defaultMaxListeners = 100;

require("express-async-errors");
require("dotenv").config();

const express = require("express");

const { initSocketConnection, app, server } = require("./server");

app.set("trust proxy", 1);

const DB = require("./db");

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

app.use(errorHandlerMiddleware, notFoundMiddleware);

/* **************************** */
process.setMaxListeners(0);

let start = async (port = process.env.PORT || 3000) => {
      try {
            const db = new DB();
            await db.connect();

            server.listen(port, () => {
                  console.log(
                        `Listening on : ${port}, visit http://localhost:${port}`
                  );
            });

            initSocketConnection();
      } catch (err) {
            console.log(err);
            process.exit(1);
      }
};

start();
