// TODO: Update file structure
const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5000;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : []; // Comma separated values
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
};

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
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

    this.sendChain(socket);
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

      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);

          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);

          break;
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({ chain: this.blockchain.chain, type: MESSAGE_TYPES.chain }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({ transaction, type: MESSAGE_TYPES.transaction }));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach((socket) => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2pServer;
