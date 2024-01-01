import React from "react";

const SmartContracts = ({
  Value,
  setValue,
  storeData,
  storeAccountAddress,
  storeAccountBalance,
  getData,
  codeHash,
  codeHashValue,
  setCodeHashValue
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
          value={Value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Your Data"
          className="px-2 py-1 outline-none mb-5"
        />
        <input
          value={codeHash}
          placeholder="Your Smart Contract Address"
          className="px-2 py-1 outline-none mb-5"
        />
        <button
          onClick={storeData}
          className="bg-gray-300 px-2 py-2 rounded-xl mb-5"
        >
          Store Data
        </button>
        <input
          value={codeHashValue}
          onChange={(e)=>setCodeHashValue(e.target.value)}
          placeholder="Enter Your Smart Contract Address"
          className="px-2 py-1 outline-none mb-5"
        />
        <button
          onClick={getData}
          className="bg-gray-300 px-2 py-2 rounded-xl mb-5"
        >
          Get Data
        </button>
      </div>
    </div>
  );
};

export default SmartContracts;
