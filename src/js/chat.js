// const { io } = require("socket.io-client");

const {
      createMsg,
      currentMinute,
      isInContainer,
      isInViewport,
} = require("./helpers");

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

// chatSocket.on("messageArrived", (payload) => {
//       console.log(payload);
// });

// ***************************************************************************

let chatHandler = () => {
      let chat = document.getElementById("chat");
      let _id = document.getElementById("_id");

      if (!chat || !_id) return;

      // @ts-ignore
      _id = _id.value;

      if (!_id) return;

      let messagesList = [];
      let page = 1;

      // window.addEventListener("beforeunload", () => {
      //       chatSocket.emit("unsetTlakingTo");
      // });

      let sendMsgBtn = document.getElementById("sendMsg");
      let messages = document.getElementById("messages");
      let textMsg = document.getElementById("textMsg");

      chatSocket.emit("fetchOldMessages", _id, page, (list) => {
            messagesList = list;
            console.log(list);
            page++;
      });

      chatSocket.on("messageArrived", (message) => {
            let msg = createMsg(
                  message._id,
                  message.content,
                  currentMinute(message.sentAt),
                  { im_sender: false, read: false }
            );

            messagesList.push(msg);
            messages.appendChild(msg);

            setTimeout(() => {
                  let messageRead =
                        isInContainer(msg, messages) && isInViewport(msg);

                  console.log(messageRead);

                  if (messageRead)
                        return chatSocket.emit("messageRead", message._id);

                  let messageJustReadEvent = new Event("messageJustRead");
                  document.addEventListener(
                        "messageJustRead",
                        () => {
                              chatSocket.emit(
                                    "messageRead",
                                    message._id,
                                    () => {
                                          messages.removeEventListener(
                                                "scroll",
                                                listener,
                                                true
                                          );
                                          window.removeEventListener(
                                                "scroll",
                                                listener,
                                                true
                                          );
                                    }
                              );
                        },
                        { once: true }
                  );

                  var listener = () => {
                        messageRead =
                              isInContainer(msg, messages) && isInViewport(msg);
                        console.log(messageRead);
                        if (messageRead)
                              document.dispatchEvent(messageJustReadEvent);
                  };

                  messages.addEventListener("scroll", listener, true);
                  window.addEventListener("scroll", listener, true);
            }, 200);
      });

      chatSocket.on("messageReadNow", (id) => {
            let msg = document.getElementById(id);
            msg.querySelector(".state").classList.add("read");
      });

      sendMsgBtn.addEventListener("click", async function () {
            // @ts-ignore
            let content = textMsg.value.trim();

            if (!content) return;

            chatSocket.emit("messageSent", content, _id, (message) => {
                  let msg = createMsg(
                        message._id,
                        message.content,
                        currentMinute(message.sentAt)
                  );

                  // @ts-ignore
                  textMsg.value = "";
                  messagesList.push(msg);
                  messages.appendChild(msg);

                  setTimeout(() => {
                        messages.scroll(0, messages.scrollHeight);
                        textMsg.focus();
                  }, 600);
            });
      });
};

window.addEventListener("DOMContentLoaded", chatHandler);
