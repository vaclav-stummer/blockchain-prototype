const express = require("express");

const Blockchain = require("./blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require("./wallet");
const TransactionPool = require("./wallet/transaction-pool");

const HTTP_PORT = process.env.HTTP_PORT || 4000;

const app = express();

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server is ready.");
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);

  console.info(`New block added: ${JSON.stringify(block)}`);

  p2pServer.syncChains();

  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, transactionPool);

  p2pServer.broadcastTransaction(transaction);

  res.redirect("/transactions");
});

app.listen(HTTP_PORT, () => console.info(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
