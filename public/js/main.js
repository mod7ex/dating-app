let socket = io();

socket.on("connect", () => {
      console.log(`connected with id; ${socket.id}`);
      document.getElementById("userID").innerHTML = socket.id;
});

let sendMessage = () => {
      let msg = document.querySelector("input#messageInput").value;

      let room = document.querySelector("input#room").value;

      if (room == "") room = null;

      socket.emit("message", msg, room);
};

document.getElementById("sendBTN").onclick = sendMessage;

socket.on("message", (msg) => {
      document.getElementById("messageArea").innerHTML = msg;
});
