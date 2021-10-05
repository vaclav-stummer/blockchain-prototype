const express = require("express");

const Blockchain = require("./blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require("./wallet");

const HTTP_PORT = process.env.HTTP_PORT || 4000;

const app = express();

const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

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

app.listen(HTTP_PORT, () => console.info(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();

const wallet = new Wallet();

console.log('ss', wallet.toString());

