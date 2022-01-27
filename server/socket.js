// const count = io.engine.clientsCount;
let { User } = require("../models");
const { NotFoundError } = require("../errors");

const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

let join_Room = async (socket) => {
      let session = socket.request.session;

      if (!session.authenticated) return;

      let room = session.user._id.toString();
      socket.join(room);
      console.log("joined room ===> ; ", room);

      // @ts-ignore
      let _id = socket.request.session.user._id;

      let user = await User.findById(_id);

      if (!user) throw new NotFoundError("User not found");

      user.connect();
};

let authSocket = (socket, next) => {
      // @ts-ignore
      let session = socket.request.session;

      if (session.authenticated) {
            return next();
      }

      return next(new Error("Not authenticated"));
};

module.exports = {
      wrap,
      join_Room,
      authSocket,
};
