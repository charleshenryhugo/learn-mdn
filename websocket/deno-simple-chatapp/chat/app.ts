import { EventName } from "../constants/eventName.ts";

const userList = document.querySelector("#user-list");
const inputMessageBox = document.querySelector("#message-input-box");
const sendMessageButton = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");

const username = prompt("Please input your name") || "Anynomous";
const socket = new WebSocket(
  `ws://localhost/start_web_socket?username=${username}`,
);

const displayNewMessage = (message: string) => {
  allMessages.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
};

const updateUserlist = (usernames: string[]) => {
  userList.innerHTML = usernames.reduce((acc, username) => {
    return `${acc}
      <li class=username>${username}</li>
    `;
  }, "");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.event === EventName.newUsername) {
    displayNewMessage(`${data.username} just joined.`);
  }

  if (data.event === EventName.deleteUsername) {
    displayNewMessage(`${data.username} just left.`);
  }

  if (data.event === EventName.updateUsernames) {
    updateUserlist(data.usernames);
  }

  if (data.event === EventName.sendMessage) {
    displayNewMessage(`${data.from}: ${data.message}`);
  }
};

socket.onclose = (event) => {
  if (event.wasClean) {
    displayNewMessage(
      `Connection is closed by server, code=${event.code}, reason=${event.reason}`,
    );
  } else {
    displayNewMessage(
      `Connection is died unexpectedly, code=${event.code}, reason=${event.reason}`,
    );
  }
};

socket.onerror = (error) => {
  displayNewMessage(JSON.stringify(error));
};

sendMessageButton.addEventListener("click", () => {
  if (!inputMessageBox.value) return;

  socket.send(JSON.stringify({
    event: "send-message",
    message: inputMessageBox.value,
  }));

  inputMessageBox.value = "";
});
