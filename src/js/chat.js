// const { io } = require("socket.io-client");

let createMsg = (
      content,
      at,
      { im_sender, read } = { im_sender: true, read: false }
) => {
      read = read && im_sender;

      let div = document.createElement("div");
      let wrapper = document.createElement("div");

      let txt = document.createElement("span");
      let span = document.createElement("span");
      let time = document.createElement("small");
      let state;
      let sender = "him";

      state = document.createElement("small");
      state.classList.add("state");
      if (im_sender) {
            if (read) state.classList.add("read");
            sender = "me";
      }

      txt.innerHTML = content;

      time.classList.add("time");
      time.innerHTML = at;

      div.classList.add("msg", sender);

      wrapper.classList.add("wrapper");
      txt.classList.add("txt");

      // **************

      span.appendChild(time);
      span.appendChild(state);

      wrapper.appendChild(txt);
      wrapper.appendChild(span);

      div.appendChild(wrapper);

      return div;
};

let saveMessage = async ({ content, to }, socket) => {
      socket.to(to).emit("messageSent", content);
};

let currentMinute = (moment = Date.now()) => {
      let d = new Date(moment);
      let hours = d.getHours().toString();
      let minutes = d.getMinutes().toString();

      if (hours.length === 1) hours = 0 + hours;

      return `${hours.length - 1 ? hours : 0 + hours}:${minutes}`;
};

let startSocket = (to) => {
      // @ts-ignore
      const socket = io();

      socket.on("connect", () => {
            console.log(socket.id);
      });

      socket.on("disconnect", () => {
            socket.to(to).emit("Edisconnected");
            console.log("user disconnected");
      });

      return socket;
};

let chatHandler = () => {
      let chat = document.getElementById("chat");

      let _id = document.getElementById("_id");

      if (!chat || !_id) return;

      // @ts-ignore
      _id = _id.value;

      let sendMsgBtn = document.getElementById("sendMsg");
      let messages = document.getElementById("messages");
      let textMsg = document.getElementById("textMsg");

      let socket = startSocket();

      sendMsgBtn.addEventListener("click", async function () {
            // @ts-ignore
            let content = textMsg.value.trim();

            if (!content) return;

            if (!socket.connected) return;
            saveMessage({ content, to: _id }, socket);

            let msg = createMsg(content, currentMinute());

            // @ts-ignore
            textMsg.value = "";
            messages.appendChild(msg);

            setTimeout(() => {
                  messages.scroll(0, messages.scrollHeight);
                  textMsg.focus();
            }, 600);
      });
};

chatHandler();
