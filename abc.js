const express = require("express");
const request = require("request");
const Block=require("../blockchain/block")
const Blockchain = require("../blockchain");
const PubSub = require("./pubsub");
const Account = require("../account");
const Transaction = require("../transaction");
const TransactionQueue = require("../transaction/transactionQueue");
const State = require("../store/state");
const app = express();
app.use(express.json());
const account = new Account();
const transactionQueue = new TransactionQueue();
const transaction = Transaction.createTransaction({ account });
const state = new State();
const blockchain = new Blockchain({ state });
const pubsub = new PubSub({ blockchain, transactionQueue });
setTimeout(() => {
  pubsub.broadCastTransaction(transaction);
}, 500);
app.get("/blockchain", (req, res, next) => {
  const { chain } = blockchain;
  res.status(200).json({
    chain,
  });
});
app.get("/account/address", (req, res, next) => {
  res.status(200).json({ address: account.address, balance: account.balance });
});
app.get("/blockchain/mine", (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  const block = Block.minedBlock({
    lastBlock,
    benificiary: account.address,
    transactionSeries: transactionQueue.getTransactionSeries(),
    stateRoot: state.getStateRoot(),
  });

  blockchain
    .addBlock({ block, transactionQueue })
    .then(() => {
      pubsub.boradcastBlock(block);
      res.status(201).json({ block });
    })
    .catch(next);
});
app.post("/account/transact", (req, res, next) => {
  const { to, value, code, gasLimit } = req.body;
  const transaction = Transaction.createTransaction({
    account: !to ? new Account({ code }) : account,
    to,
    value,
    gasLimit,
  });
  pubsub.broadCastTransaction(transaction);
  res.status(200).json({ transaction });
});
app.get("/account/balance", (req, res, next) => {
  const { address } = req.query;
  const balance = Account.calculateBalance({
    address: address || account.address,
    state,
  });
  res.status(200).json({ balance });
});
app.use((err, req, res, next) => {
  console.log("Internal Server Error", err.message);
  res.status(500).json({
    message: err.message,
  });
});
app.get(`/`,(req,res,next)=>{
  res.status(200).json({message:"Hello World"});
})


let peer; 
app.get("/blockchain--peer", (req, res, next) => {
  peer=Math.floor(2000+Math.random()*1000);
  request("http://localhost:3000/blockchain", (error, response, body) => {
    const { chain } = JSON.parse(body);
    blockchain
      .replaceChain({ chain })
      .then(() => {
        res
          .status(200)
          .json({
            message:`http://localhost:${peer}/blockchain/mine`,
            chain
          });
        console.log("Synchronized successfully blockchin with the root note",chain);
        app.listen(peer,()=>{
          console.log(`Your local server is running on port ${peer}`)
        })
      })
      .catch((error) => {
        console.log("Synchronization error", error.message);
      });
  });
});
module.exports=app;