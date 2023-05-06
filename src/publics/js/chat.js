const socket = io();

let sendMessageForm = document.getElementById("sendMessage");
let user = sendMessageForm.dataset.username;

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target[0].value.trim();
  socket.emit("newMessage", { user, message });
  e.target.reset();
});

socket.on("messagesListUpdated", () => {
  location.reload();
});