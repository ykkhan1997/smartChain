const { GENESIS_DATA, MINE_RATE } = require("./config");
const { keccakHash } = require("../util");
const Transaction = require("../transaction");
const Trie = require("../store/trie");
const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt("f".repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64;
class Block {
  constructor({ blockHeaders, transactionSeries }) {
    this.blockHeaders = blockHeaders;
    this.transactionSeries = transactionSeries;
  }
  static calculateBlockTargetHash({ lastBlock }) {
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(
      16
    );
    if (value.length > HASH_LENGTH) {
      return "f".repeat(HASH_LENGTH);
    }
    return "0".repeat(HASH_LENGTH - value.length) + value;
  }
  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock.blockHeaders;
    if (timestamp - lastBlock.blockHeaders.timestamp > MINE_RATE) {
      return difficulty - 1;
    }
    if (difficulty < 1) {
      return 1;
    }
    return difficulty + 1;
  }
  static minedBlock({ lastBlock, benificiary, transactionSeries, stateRoot }) {
    const target = Block.calculateBlockTargetHash({ lastBlock });
    const miningRewardTransaction=Transaction.createTransaction({benificiary});
    transactionSeries.push(miningRewardTransaction);
    const transactionTrie = Trie.buildTrie({ items: transactionSeries });
    let timestamp, truncatedBlockHeaders, headers, nonce, underTargetHash;
    do {
      timestamp = Date.now();
      truncatedBlockHeaders = {
        parentHash: keccakHash(lastBlock.blockHeaders),
        benificiary,
        timestamp,
        number: lastBlock.blockHeaders.number + 1,
        difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
        /**
         * Note:The transaction Trie will be refactored once trie are implemented;
         */
        // transactionRoot: keccakHash(transactionSeries),
        transactionRoot: transactionTrie.rootHash,
        stateRoot,
      };
      headers = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
      underTargetHash = keccakHash(headers + nonce);
    } while (underTargetHash > target);
    return new this({
      blockHeaders: { ...truncatedBlockHeaders, nonce },
      transactionSeries,
    });
  }
  static genesis() {
    return new Block(GENESIS_DATA);
  }
  static validateBlock({ lastBlock, block, state }) {
    return new Promise((resolve, reject) => {
      if (keccakHash(Block.genesis()) === keccakHash(block)) {
        return resolve();
      }
      if (keccakHash(lastBlock.blockHeaders) != block.blockHeaders.parentHash) {
        return reject(
          new Error(`The parenthash must be the hash of the last block headers`)
        );
      }
      if (block.blockHeaders.number != lastBlock.blockHeaders.number + 1) {
        return reject(
          new Error(`The block must only increment the number by 1`)
        );
      }
      if (
        Math.abs(
          block.blockHeaders.difficulty - lastBlock.blockHeaders.difficulty
        ) > 1
      ) {
        return reject(new Error("The block difficulty must only adjust by 1"));
      }
      const rebuildTransactionTrie = Trie.buildTrie({
        items: block.transactionSeries,
      });
      if (
        rebuildTransactionTrie.rootHash !== block.blockHeaders.transactionRoot
      ) {
        return reject(
          new Error(
            `The rebuildTransactionTrie doesnot match the block's transactionRoot ${block.blockHeaders.transactionRoot}`
          )
        );
      }
      const target = Block.calculateBlockTargetHash({ lastBlock });
      const { blockHeaders } = block;
      const { nonce } = blockHeaders;
      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;
      const headers = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(headers + nonce);
      if (underTargetHash > target) {
        return reject(
          new Error("The block doesnot meet the proof of work requirements")
        );
      }
      Transaction.validateTransactionSeries({
        state,
        transactionSeries: block.transactionSeries,
      })
        .then(resolve)
        .catch(reject);
    });
  }
  static runBlock({ block, state }) {
    for (let transaction of block.transactionSeries) {
      Transaction.runTransaction({ transaction, state });
    }
  }
}
module.exports = Block;
