import { SmartContracts } from "@/Components";
import { smartChainContext } from "@/Context";
import React, { useContext, useEffect, useState } from "react";

const SmartContract = () => {
  const {
    setKey,
    Value,
    setValue,
    storeData,
    accountAddress,
    accountBalance,
    codeHash,
    getData,
    codeHashValue,
    setCodeHashValue,
  } = useContext(smartChainContext);
  const [storeAccountAddress, setStoreAccountAddress] = useState("");
  const [storeAccountBalance, setStoreAccountBalance] = useState("");
  useEffect(() => {
    const storeAccountAddress = localStorage.getItem("accountAddress");
    if (storeAccountAddress) {
      setStoreAccountAddress(storeAccountAddress);
      setKey(storeAccountAddress);
    }
    const storeAccountBalance = localStorage.getItem("accountBalance");
    const parsestoreAccountBalance = parseInt(storeAccountBalance, 10);
    if (parsestoreAccountBalance) {
      setStoreAccountBalance(parsestoreAccountBalance);
    }
  }, [accountAddress, accountBalance,]);
  return (
    <div>
      <SmartContracts
        Value={Value}
        setValue={setValue}
        storeData={storeData}
        storeAccountAddress={storeAccountAddress}
        storeAccountBalance={storeAccountBalance}
        getData={getData}
        codeHash={codeHash}
        codeHashValue={codeHashValue}
        setCodeHashValue={setCodeHashValue}
      />
    </div>
  );
};

export default SmartContract;
