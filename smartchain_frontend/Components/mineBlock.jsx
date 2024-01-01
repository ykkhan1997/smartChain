import axios from "axios";
import React from "react";
import Link from "next/link";
const MineBlocks = ({
  getMineBlock,
  mineBlock,
  replaceMessage,
  requestPeer,
}) => {
  console.log(replaceMessage);
  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <h1 className="px-2 py-4 rounded border-[1px] shadow-inner mt-10 w-full text-center text-[18px] font-medium">
        Mine Block to get Rewards
      </h1>
      <button
        onClick={requestPeer}
        className="px-4 py-4 rounded bg-gray-100 hover:text-gray-500"
      >
        Request To Mine a Block
      </button>
      {replaceMessage ? (
        <p className="font-medium bg-gray-100 px-2 py-2 rounded text-black">
          Synchronization request successfully accepted you can use this{" "}
          <Link legacyBehavior href={replaceMessage}><a className="text-blue-500 cursor-pointer" target="_blank">{replaceMessage}</a></Link> to mine a block
        </p>
      ) : (
        ""
      )}
      <button
        onClick={getMineBlock}
        className="px-4 py-4 rounded bg-gray-100 hover:text-gray-500"
      >
        MineBlock
      </button>
      <div className="">
        <div className="bg-gray-100 px-4 py-4 rounded-xl">
          {mineBlock ? (
            <ul>
              <li>
                parentHash:{mineBlock.blockHeaders?.parentHash.slice(0, 25)}
              </li>
              <li>
                Benificiary:{mineBlock.blockHeaders?.benificiary.slice(0, 25)}
              </li>
              <li>Timestamp:{mineBlock.blockHeaders?.timestamp}</li>
              <li>Nonce:{mineBlock.blockHeaders?.nonce}</li>
              <li>Number:{mineBlock.blockHeaders?.number}</li>
              <li>Difficulty:{mineBlock.blockHeaders?.difficulty}</li>
              <li>
                transactionRoot:
                {mineBlock.blockHeaders?.transactionRoot.slice(0, 25)}
              </li>
              <li>
                StateRoot:{mineBlock.blockHeaders?.stateRoot.slice(0, 25)}
              </li>
              {mineBlock.transactionSeries?.map((transaction) => (
                <ul>
                  <li>TransactionId:{transaction.id}</li>
                  <li>
                    From:{transaction.from.slice(0, 30)}...
                    {transaction.from.slice(-4)}
                  </li>
                  <li>
                    To:{transaction.to.slice(0, 30)}...
                    {transaction.to.slice(-4)}
                  </li>
                  <li>Value:{transaction.value}</li>
                  <li>Data:{transaction.data.type}</li>
                  <li>
                    Address:{transaction.data.accountData?.address.slice(0, 30)}
                    {transaction.data.accountData?.address.slice(-4)}
                  </li>
                  <li>Balance:{transaction.data.accountData?.balance}</li>
                </ul>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MineBlocks;
