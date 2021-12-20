require("express-async-errors");
require("dotenv").config();

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const DB = require("./db/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let session = require("express-session");
app.set("trust proxy", 1);
app.use(
      session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                  secure: true,
                  httpOnly: true,
                  maxAge: 1000 * 60 * 60 * 24,
            },
      })
);

// security
app.disable("x-powered-by");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
      res.render("home");
});

/* ************************************************ */

//const { Server } = require("socket.io");
// const io = new Server(server, {
//       cors: { origin: ["http://localhost:3000/"] },
// });

// io.on("connection", (socket) => {
//       console.log(`user connected; ${socket.id}`);

//       socket.on("message", (msg, room) => {
//             if (room) {
//                   socket.to(room).emit("message", msg);
//             } else {
//                   socket.broadcast.emit("message", msg);
//             }
//       });
// });

/* ************************************************ */
let port = process.env.PORT || 3000;

let start = async () => {
      let db = new DB();

      await db.connect();

      server.listen(port, () => {
            console.log(
                  `Listening on : ${port}, visit http://localhost:${port}`
            );
      });
};

start();
