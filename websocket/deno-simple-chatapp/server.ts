import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { EventName } from "./constants/eventName.ts";

const connectedClients = new Map<string, WebSocket>();

const app = new Application();
const port = 80;
const router = new Router();

const broadcast = (message: string) => {
  connectedClients.forEach((socket) => {
    socket.send(message);
  });
};

const broadcastUpdateUserNames = () => {
  const usernames = [...connectedClients.keys()];
  console.info(
    `Will broadcast updated usernames to all clients: ${
      JSON.stringify(usernames)
    }`,
  );
  broadcast(JSON.stringify({
    event: EventName.updateUsernames,
    usernames,
  }));
};

router.get("/start_web_socket", (ctx) => {
  try {
    const socket = ctx.upgrade();
    const username = ctx.request.url.searchParams.get("username");

    if (!username) {
      socket.close(1008, `invalid username`);
      return;
    }

    if (connectedClients.has(username)) {
      socket.close(
        1008,
        `${username} has already taken a web socket connection`,
      );
      return;
    }

    socket.onopen = () => {
      console.info(`CONNECTED from ${username}`);
      connectedClients.set(username, socket);

      broadcast(JSON.stringify({
        event: EventName.newUsername,
        username,
      }));

      broadcastUpdateUserNames();
    };

    socket.onclose = () => {
      console.info(`DISCONNECTED from ${username}`);
      connectedClients.delete(username);

      broadcast(JSON.stringify({
        event: EventName.deleteUsername,
        username,
      }));

      broadcastUpdateUserNames();
    };

    type MessageEventData = {
      event: EventName;
      from?: string;
      message: string;
    };
    /* when received a message from client */
    socket.onmessage = (
      messageEvent: MessageEvent<string>,
    ) => {
      const data: MessageEventData = JSON.parse(messageEvent.data);

      if (data.event === EventName.sendMessage) {
        broadcast(
          JSON.stringify(
            {
              event: EventName.sendMessage,
              from: username,
              message: data.message,
            } as MessageEventData,
          ),
        );
      }
    };

    socket.onerror = (error) => {
      console.info(`Oops:`, error);
      socket.close(1011, JSON.stringify(error));
      return;
    };
  } catch (e) {
    console.info(e);
  }
});

router.get("/chat", async (ctx) => {
  // chat/index.html
  await ctx.send({
    root: `${Deno.cwd()}/`,
    index: "index.html",
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context) => {
  console.info(context.request.url);
  // public/index.html;
  await context.send({
    root: `${Deno.cwd()}/`,
    index: "public/index.html",
  });
});

app.listen({ port });
console.info(`Listening at http://localhost:${port}/chat`);
