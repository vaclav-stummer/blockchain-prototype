const express = require("express");
const res = require("express/lib/response");

const Blockchain = require("./domains/blockchain/");

const HTTP_PORT = process.env.HTTP_PORT || 4000;

const app = express();

const blockchain = new Blockchain();

app.get("/", (req, res) => {
  res.json("Server is ready.");
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.listen(HTTP_PORT, () => console.info(`Listening on port ${HTTP_PORT}`));
