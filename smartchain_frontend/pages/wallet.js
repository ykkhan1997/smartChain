import React, { useContext, useEffect, useState } from "react";
import { smartChainContext } from "@/Context";
import { Wallets } from "@/Components";
const Wallet = () => {
  const {
    accountAddress,
    accountBalance,
    getAccountData,
    transactionAddress,
    setTransactionAddress,
    transactionValue,
    setTransactionValue,
    sendTransactions,
    createAccount,
    recipientAddress,
    recipientBalance
  } = useContext(smartChainContext);
  const [storeAccountAddress, setStoreAccountAddress] = useState("");
  const [storeAccountBalance, setStoreAccountBalance] = useState("");
  const [storeRecipientAddress,setStoreRecipientAddress]=useState("");
  const [storeRecipientBalance,setStoreRecipientBalance]=useState("");
  
  useEffect(() => {
    const storeAccountAddress = localStorage.getItem("accountAddress");
    if (storeAccountAddress) {
      setStoreAccountAddress(storeAccountAddress);
    }
    const storeAccountBalance = localStorage.getItem("accountBalance");
    const parsestoreAccountBalance=parseInt(storeAccountBalance,10);
    if (parsestoreAccountBalance) {
      setStoreAccountBalance(parsestoreAccountBalance);
    }
    const storeRecipientAddress=localStorage.getItem("recipientAddress");
    if(storeRecipientAddress){
      setStoreRecipientAddress(storeRecipientAddress);
    }
    const storeRecipientBalance=localStorage.getItem("recipientBalance");
    if(storeRecipientBalance){
      setStoreRecipientBalance(storeRecipientBalance);
    }
  }, [accountAddress, accountBalance,recipientAddress,recipientBalance]);
  return (
    <div>
      <Wallets
        accountAddress={accountAddress}
        accountBalance={accountBalance}
        getAccountData={getAccountData}
        storeAccountAddress={storeAccountAddress}
        storeAccountBalance={storeAccountBalance}
        transactionAddress={transactionAddress}
        transactionValue={transactionValue}
        setTransactionAddress={setTransactionAddress}
        setTransactionValue={setTransactionValue}
        sendTransactions={sendTransactions}
        createAccount={createAccount}
        storeRecipientAddress={storeRecipientAddress}
        storeRecipientBalance={storeRecipientBalance}
      />
    </div>
  );
};

export default Wallet;
