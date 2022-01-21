// const { io } = require("socket.io-client");

// ***************************************************************************

// @ts-ignore
const chatSocket = io("/chat");

chatSocket.on("connect", () => {
      console.log(chatSocket.id);
});

chatSocket.on("disconnect", () => {
      console.log("socket disconnected (client)");
});

chatSocket.once("closeConnection", () => {
      chatSocket.disconnect();
      console.log("connection closed from client.");
});

chatSocket.on("connect_error", (err) => {
      console.log(err.message);
});

chatSocket.on("messageArrived", (payload) => {
      console.log(payload);
});

let emitEvent = (eventName, ...args) => {
      if (!chatSocket.connected) return;

      chatSocket.emit(eventName, ...args);
};

// ***************************************************************************

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

let currentMinute = (moment = Date.now()) => {
      let d = new Date(moment);
      let hours = d.getHours().toString();
      let minutes = d.getMinutes().toString();

      if (hours.length === 1) hours = 0 + hours;

      return `${hours.length - 1 ? hours : 0 + hours}:${minutes}`;
};

let chatHandler = () => {
      let chat = document.getElementById("chat");
      let _id = document.getElementById("_id");

      if (!chat || !_id) return;

      // @ts-ignore
      _id = _id.value;

      if (!_id) return;

      let sendMsgBtn = document.getElementById("sendMsg");
      let messages = document.getElementById("messages");
      let textMsg = document.getElementById("textMsg");

      sendMsgBtn.addEventListener("click", async function () {
            // @ts-ignore
            let content = textMsg.value.trim();

            if (!content) return;

            emitEvent("messageSent", content, _id, (payload) => {
                  let msg = createMsg(content, currentMinute(payload));

                  // @ts-ignore
                  textMsg.value = "";
                  messages.appendChild(msg);

                  setTimeout(() => {
                        messages.scroll(0, messages.scrollHeight);
                        textMsg.focus();
                  }, 600);
            });
      });
};

window.addEventListener("DOMContentLoaded", chatHandler);
