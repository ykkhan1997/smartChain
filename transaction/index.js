const InterPreter = require("../Interpreter");
const Account = require("../account");
const uuid = require("uuid").v4;
const { MINING_REWARD } = require("../blockchain/config");
const TRANSACTION_TYPE_MAP = {
  TRANSACT: "TRANSACT",
  CREATEACCOUNT: "CREATEACCOUNT",
  MINING_REWARD_TRANSACT: "MINING_REWARD_TRANSACT",
};
class Transaction {
  constructor({ id, from, to, value, data, signature, gasLimit }) {
    this.id = id || uuid();
    this.from = from || "-";
    this.to = to || "-";
    this.value = value || 0;
    this.data = data || "-";
    this.signature = signature || "-";
    this.gasLimit = gasLimit;
  }
  static createTransaction({ account, to, value, benificiary, gasLimit }) {
    if (benificiary) {
      return new Transaction({
        to: benificiary,
        value: MINING_REWARD,
        gasLimit,
        data: { type: TRANSACTION_TYPE_MAP.MINING_REWARD_TRANSACT },
      });
    }
    if (to) {
      const transactionData = {
        id: uuid(),
        from: account.address,
        to,
        value: value || 0,
        gasLimit: gasLimit || 0,
        data: { type: TRANSACTION_TYPE_MAP.TRANSACT },
      };
      return new Transaction({
        ...transactionData,
        signature: account.sign(transactionData),
      });
    }
    return new Transaction({
      data: {
        type: TRANSACTION_TYPE_MAP.CREATEACCOUNT,
        accountData: account.toJSON(),
      },
    });
  }
  static validateStandardTransaction({ state, transaction }) {
    return new Promise((resolve, reject) => {
      const { id, from, to, value, signature, gasLimit } = transaction;
      const transactionData = { ...transaction };
      delete transactionData.signature;
      if (
        !Account.verifySignature({
          publicKey: from,
          data: transactionData,
          signature,
        })
      ) {
        return reject(
          new Error(`The transaction id ${id} is an invalid signature`)
        );
      }
      const fromBalance = state.getAccount({ address: from }).balance;
      if (value + gasLimit > fromBalance) {
        return reject(
          new Error(
            `Transaction value and gasLimit ${value} exceeds balance ${fromBalance}`
          )
        );
      }
      const toAccount = state.getAccount({ address: to });
      if (!toAccount) {
        return reject(new Error(`The to field ${toAccount} doesnot exist`));
      }
      if (toAccount.codeHash) {
        const { gasUsed } = new InterPreter({
          storageTrie: state.storageTrieMap[toAccount.codeHash],
        }).runCode(toAccount.code);

        if (gasUsed > gasLimit) {
          return reject(
            new Error(
              `Transaction need more gas provided ${gasLimit} needs ${gasUsed}`
            )
          );
        }
      }
      return resolve();
    });
  }
  static validateCreateAccountTransaction({ transaction }) {
    return new Promise((resolve, reject) => {
      const expectedAccountDataFields = Object.keys(new Account().toJSON());
      const fields = Object.keys(transaction.data.accountData);
      if (fields.length !== expectedAccountDataFields.length) {
        return reject(
          new Error(
            `The transaction accountdata is an incorrect number of fields`
          )
        );
      }
      fields.forEach((field) => {
        if (!expectedAccountDataFields.includes(field)) {
          return reject(
            new Error(`The field ${field} is incorrect for account data`)
          );
        }
      });
      return resolve();
    });
  }
  static validateMiningRewardTransaction({ state, transaction }) {
    return new Promise((resolve, reject) => {
      const { value } = transaction;
      if (value != MINING_REWARD) {
        return reject(
          new Error(
            `The miningReward Transaction value ${value} doesnot equal to the official mining reward ${MINING_REWARD}`
          )
        );
      }
      return resolve();
    });
  }
  static validateTransactionSeries({ state, transactionSeries }) {
    return new Promise((resolve, reject) => {
      for (let transaction of transactionSeries) {
        try {
          switch (transaction.data.type) {
            case TRANSACTION_TYPE_MAP.TRANSACT:
              Transaction.validateStandardTransaction({ state, transaction });
              break;
            case TRANSACTION_TYPE_MAP.CREATEACCOUNT:
              Transaction.validateCreateAccountTransaction({ transaction });
              break;
            case TRANSACTION_TYPE_MAP.MINING_REWARD_TRANSACT:
              Transaction.validateMiningRewardTransaction({
                state,
                transaction,
              });
              break;
            default:
              break;
          }
        } catch (error) {
          reject(error);
        }
      }
      return resolve();
    });
  }
  static runTransaction({ state, transaction }) {
    switch (transaction.data.type) {
      case TRANSACTION_TYPE_MAP.TRANSACT:
        Transaction.runStandardTransaction({ state, transaction });
        console.log("Update Account Data to reflect StandardTransaction");
        break;
      case TRANSACTION_TYPE_MAP.CREATEACCOUNT:
        Transaction.runCreateAccountTransaction({ state, transaction });
        console.log("Store Account Data");
        break;
      case TRANSACTION_TYPE_MAP.MINING_REWARD_TRANSACT:
        Transaction.runMiningRewardTransaction({ state, transaction });
        console.log("update Account Data to reflect mining reward transaction");
        break;
      default:
        break;
    }
  }
  static runStandardTransaction({ state, transaction }) {
    const fromAccount = state.getAccount({ address: transaction.from });
    const toAccount = state.getAccount({ address: transaction.to });
    let gasUsed = 0;
    let result;
    if (toAccount.codeHash) {
      const interpreter = new InterPreter({
        storageTrie: state.storageTrieMap[toAccount.codeHash],
      });
      ({ gasUsed, result } = interpreter.runCode(toAccount.code));
      console.log("Smart Contract Execution", transaction.id, "RESULT", result);
    }
    const { value, gasLimit } = transaction;
    const refund = gasLimit - gasUsed;
    fromAccount.balance -= value;
    fromAccount.balance -= gasLimit;
    fromAccount.balance += refund;
    toAccount.balance += value;
    toAccount.balance += gasUsed;
    state.putAccount({ address: transaction.from, accountData: fromAccount });
    state.putAccount({ address: transaction.to, accountData: toAccount });
  }
  static runCreateAccountTransaction({ state, transaction }) {
    const { accountData } = transaction.data;
    const { address, codeHash } = accountData;
    state.putAccount({ address: codeHash ? codeHash : address, accountData });
  }
  static runMiningRewardTransaction({ state, transaction }) {
    const { to, value } = transaction;
    const accountData = state.getAccount({ address: to });
    accountData.balance += value;
    state.putAccount({ address: to, accountData });
  }
}
module.exports = Transaction;
