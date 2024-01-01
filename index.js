const express = require("express");
const BlockChain = require("./blockchain/index.js");
const State = require("./store/state.js");

const state = new State();
const blockchain = new BlockChain({ state });
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).json("Hello World");
});
app.get("/blockchain", (req, res, next) => {
  try {
    const { chain } = blockchain;
    res.status(200).json({ chain });
  } catch(error){
    next(error);
  }
});
app.use((err, req, res, next) => {
  console.log(`Internal server error 500 ${err.message}`);
  res.status(500).json({ message: err.message });
});
let PORT;
let port = PORT || 3000;

app.listen(port, () => {
  console.log(`Your Port is running on port ${port}`);
});
