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

            socket.on("messageSent", async (content, _id, cb) => {
                  let message = await messageController.createMessage(
                        socket.request,
                        _id,
                        content
                  );

                  let room = message.reciever.toString();

                  // check if online.

                  socket.to(room).emit("messageArrived", message);

                  cb(message);
            });

            socket.on("messageRead", async (id, cb) => {
                  let message = await messageController.messageRead(id);

                  let room = message.sender.toString();

                  // check if online.

                  socket.to(room).emit("messageReadNow", message._id);

                  cb();
            });

            socket.on("fetchOldMessages", async (reciever, page, cb) => {
                  // @ts-ignore
                  let sender = socket.request.session.user._id;

                  let messages = await messageController.fetchMessages(
                        sender,
                        reciever,
                        page
                  );

                  cb(messages);
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
