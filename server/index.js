const express = require("express");
const http = require("http");

const { MessageController } = require("../controllers");

const { Server } = require("socket.io");

const { join_Room, wrap, authSocket } = require("./socket");

const { sessionMiddleware } = require("../middlewares");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

let chatIO = io.of("/chat");

chatIO.use(wrap(sessionMiddleware));
chatIO.use(authSocket);

let messageController = new MessageController();

let initSocketConnection = () => {
      chatIO.on("connection", (socket) => {
            console.log("connected, socket id ===> ", socket.id);

            join_Room(socket);

            socket.once("messageSent", async (content, _id, cb) => {
                  let sentAt = await messageController.createMessage(
                        socket.request,
                        _id,
                        content
                  );

                  // check if online.
                  // @ts-ignore
                  let sender = socket.request.session.user._id;
                  socket.to(_id).emit("messageArrived", {
                        content,
                        sentAt,
                        sender,
                  });

                  cb(sentAt);
            });

            socket.on("disconnect", (reason) => {
                  console.log("disconnected ===> ", reason);
            });
      });
};

module.exports = {
      initSocketConnection,
      app,
      server,
};
