let createMsg = (content, at, { im_sender, read }) => {
      let div = document.createElement("div");
      let wrapper = document.createElement("div");

      let txt = document.createElement("span");
      let span = document.createElement("span");
      let time = document.createElement("small");
      let state;
      let sender = "him";

      if (im_sender) {
            state = document.createElement("small");
            state.classList.add("state");
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

let chatHandler = () => {
      let chat = document.getElementById("chat");

      if (!chat) return;

      let sendMsgBtn = document.getElementById("sendMsg");
      let messages = document.getElementById("messages");
      let textMsg = document.getElementById("textMsg");

      sendMsgBtn.addEventListener("click", function () {
            // @ts-ignore
            let content = textMsg.value;

            if (!content) return;

            let msg = createMsg(content, "03:36", {
                  im_sender: true,
                  read: false,
            });

            // @ts-ignore
            textMsg.value = "";
            messages.appendChild(msg);

            // messages.scroll(0, messages.scrollHeight - messages.offsetHeight);
            setTimeout(() => {
                  messages.scroll(0, 100);
                  textMsg.focus();
            }, 600);
      });
};

chatHandler();
