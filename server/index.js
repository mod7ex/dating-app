const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

let startSocket = () => {
      io.on("connection", (socket) => {
            console.log("socket id ====> :", socket.id);

            socket.on("disconnect", () => {
                  console.log("user disconnected");
            });
      });
};

module.exports = { app, server, io, startSocket };
