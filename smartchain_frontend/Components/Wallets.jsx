import React from "react";

const Wallets = ({
  getAccountData,
  storeAccountAddress,
  storeAccountBalance,
  transactionAddress,
  setTransactionAddress,
  transactionValue,
  setTransactionValue,
  sendTransactions,
  createAccount,
  storeRecipientAddress,
  storeRecipientBalance
}) => {
  return (
    <div className="w-[98%] flex items-center justify-center mt-5">
      <div className="w-[30%] bg-gray-100 flex flex-col items-center px-2 py-4">
        <h1 className="font-medium px-2 py-2 rounded-xl tracking-wide">
          Smart Wallet
        </h1>
        <input
          value={storeAccountBalance}
          className="px-2 py-1 bg-transparent outline-none text-center"
        />
        <input
          value={storeAccountAddress}
          className="px-2 py-1 bg-transparent outline-none"
        />
        <input
          value={transactionValue}
          className="px-2 py-1 outline-none mb-1"
          type="number"
          placeholder="Please Enter Amount"
          onChange={(e)=>setTransactionValue(e.target.value)}
        />
        <input
          value={transactionAddress}
          type="text"
          placeholder="Please Enter Recipient Address"
          onChange={(e)=>setTransactionAddress(e.target.value)}
          className="px-2 py-1 outline-none mb-5"
        />
        <input
          value={storeRecipientBalance}
          type="number"
          className="px-2 py-1 outline-none mb-5"
        />
        <input
          value={storeRecipientAddress}
          type="text"
          className="px-2 py-1 outline-none mb-5"
        />
        <button
          onClick={sendTransactions}
          className="bg-gray-300 px-2 py-2 rounded-xl mb-5"
        >
         Send
        </button>
        <button
          onClick={createAccount}
          className="bg-gray-300 px-2 py-2 rounded-xl mb-5"
        >
         Create Account
        </button>
        <button
          onClick={getAccountData}
          className="bg-gray-300 px-2 py-2 rounded-xl mb-5"
        >
         Generate Main Account
        </button>
      </div>
    </div>
  );
};

export default Wallets;
