import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASEURL } from "./config";

export const smartChainContext = createContext();
const SmartChainProvider = ({ children }) => {
  const [blockChain, setBlockChain] = useState([]);
  const [filterBlockChain, setFilterBlockChain] = useState([]);
  const [transactionSeries, setTransactionSeries] = useState([]);
  const [filterTransactions, setFilterTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mineBlock, setMineBlock] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [transactionValue, setTransactionValue] = useState(null);
  const [transactionAddress, setTransactionAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientBalance, setRecipientBalance] = useState("");
  const [Key,setKey]=useState("");
  const [Value,setValue]=useState("");
  const [codeHash,setCodeHash]=useState("");
  const [codeHashValue,setCodeHashValue]=useState("");
  /**
Transaction and Smart Contract Area
*/
const storeData=async()=>{
  await axios.post(`${BASEURL}/account/transact`,{
    code:["PUSH",Value,"PUSH",Key,"STORE","PUSH",Key,"LOAD","STOP"]
  }).then((response)=>{
    setCodeHash(response.data.transaction.data.accountData.codeHash);
  });
}
const getData=async()=>{
  await axios.post(`${BASEURL}/account/transact`,{
    to:codeHashValue,
    gasLimit:parseInt(10)
  }).then(()=>{
    alert('Successfully transact mined block to get data');
  })
}
  const getAccountData = async () => {
    await axios.get(`${BASEURL}/account/address`).then((response) => {
      setAccountAddress(response.data.address);
      setAccountBalance(response.data.balance);
      localStorage.setItem("accountAddress", response.data.address);
      localStorage.setItem("accountBalance", response.data.balance);
    });
  };
  
  const sendTransactions = async () => {
    try {
      await axios
        .post(`${BASEURL}/account/transact`, {
          to: transactionAddress,
          value: parseInt(transactionValue),
        })
        .then(() => {
          alert("Transaction Successfully Created");
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const createAccount = async () => {
    await axios.post(`${BASEURL}/account/transact`).then((response) => {
      const address = response.data.transaction.data.accountData?.address;
      setRecipientAddress(address);
      const balance = response.data.transaction.data.accountData?.balance;
      setRecipientBalance(balance);
      localStorage.setItem("recipientAddress", address);
      localStorage.setItem("recipientBalance", balance);
    });
  };
  /**
Transaction and Smart Contract Area
*/
  const handleOnChange = (value) => {
    if (!value.trim()) {
      setFilterBlockChain(blockChain);
    }
    setSearchTerm(value);
  };
  const hanldeClickSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredResults = blockChain.filter((block) =>
      Object.values(block.blockHeaders).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    const filterTransactionsData = transactionSeries.filter((transaction) => {
      const address = transaction.data.accountData?.address;
      return (
        address.includes(lowerCaseSearchTerm) ||
        Object.values(transaction).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    });
    setFilterTransactions(filterTransactionsData);
    setFilterBlockChain(filteredResults);
  };
  useEffect(() => {
    const getBlockChainData = async () => {
      const blockchainData = await axios.get(`${BASEURL}/blockchain`);
      const data = await blockchainData.data;
      setBlockChain(data.chain.reverse());
      const transactionData = data.chain.flatMap(
        (block) => block.transactionSeries
      );
      setTransactionSeries(transactionData);
    };
    getBlockChainData();
  }, []);
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredResults = blockChain.filter((block) =>
      Object.values(block.blockHeaders).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    const filterTransactionsData = transactionSeries.filter((transaction) =>
      Object.values(transaction).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    setFilterTransactions(filterTransactionsData);
    setFilterBlockChain(filteredResults);
  }, [searchTerm, blockChain, transactionSeries]);
  const getMineBlock = async () => {
    try {
      await axios.get(`${BASEURL}/blockchain/mine`).then((response) => {
        setMineBlock(response.data.block);
      });
      alert("Successfully mined a block");
      setCodeHash("");
      setValue("");
      setCodeHashValue("");
      if (accountAddress) {
        setTimeout(async () => {
          const accountAddress = localStorage.getItem("accountAddress");
          await axios
            .get(`${BASEURL}/account/balance?address=${accountAddress}`)
            .then((response) => {
              setAccountBalance(response.data.balance);
              localStorage.setItem("accountBalance", response.data.balance);
            });
        }, 500);
      } else {
        return;
      }
      if (recipientAddress) {
        setTimeout(async () => {
          const recipientAddress = localStorage.getItem("recipientAddress");
          await axios
            .get(`${BASEURL}/account/balance?address=${recipientAddress}`)
            .then((response) => {
              setRecipientBalance(response.data.balance);
              localStorage.setItem("recipientBalance", response.data.balance);
            });
        }, 500);
      } else {
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <smartChainContext.Provider
      value={{
        searchTerm,
        handleOnChange,
        hanldeClickSearch,
        filterBlockChain,
        filterTransactions,
        getMineBlock,
        mineBlock,
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
        recipientBalance,
        Key,
        setKey,
        Value,
        setValue,
        storeData,
        codeHash,
        getData,
        codeHashValue,
        setCodeHashValue
      }}
    >
      {children}
    </smartChainContext.Provider>
  );
};

export default SmartChainProvider;
