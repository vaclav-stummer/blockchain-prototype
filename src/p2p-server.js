// TODO: Update file structure
const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5000;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : []; // Comma separated values

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });

    server.on("connection", (socket) => this.connectSocket(socket));

    this.connectToPeers();

    console.info(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.info("Socket connected");

    this.messageHandler(socket);

    socket.send(JSON.stringify(this.blockchain.chain));
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new Websocket(peer); // e.g.: ws://localhost:5000

      socket.on("open", () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on("message", (message) => {
      const data = JSON.parse(message);

      console.info("[P2pServer:messageHandler]: data", data);
    });
  }
}

module.exports = P2pServer;
