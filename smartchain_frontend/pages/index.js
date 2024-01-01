import React, { useContext } from "react";
import { smartChainContext } from "@/Context";
import { Search } from "@/Components";
import Image from "next/image";
import { Background } from "@/public";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Home = () => {
  const {
    searchTerm,
    handleOnChange,
    hanldeClickSearch,
    filterBlockChain,
    filterTransactions,
  } = useContext(smartChainContext);
  const router = useRouter();
  return (
    <div>
      <div className="bg-gray-100">
        <Image
          src={Background}
          alt="backgroundImage"
          width={1400}
          height={400}
        />
        <div className="">
          <h1 className="mt-[-110px] ml-10 text-[18px] tracking-wide text-white font-medium">
            The Ethereum Blockchain Explorer
          </h1>
          <Search
            searchTerm={searchTerm}
            onChange={handleOnChange}
            onClick={hanldeClickSearch}
          />
          <div className="flex items-center justify-between px-2">
            <div className="grid grid-rows gap-4 bg-white w-[48%] overflow-hidden">
              <div>
                <h1 className="px-2 py-4 font-medium tracking-wider text-[18px] border-[1px] shadow-inner">
                  Latest Blocks
                </h1>
                {filterBlockChain.slice(0, 5).map((block, i) => (
                  <ul
                    key={i + 1}
                    className="px-2 py-4 border-[0.1px] shadow-inner tracking-wider"
                  >
                    <li>
                      parentHash:{block.blockHeaders.parentHash.slice(0,30)}...
                      {block.blockHeaders.parentHash.slice(-4)}
                    </li>
                    <li>
                      Benificiary:{block.blockHeaders.benificiary.slice(0,30)}
                      ...{block.blockHeaders.benificiary.slice(-4)}
                    </li>
                    <li>BlockNumber:{block.blockHeaders.number}</li>
                  </ul>
                ))}
                <button
                  onClick={() => router.push("/block")}
                  className="px-2 py-4 font-medium tracking-wider text-[18px] border-[1px] shadow-inner w-full uppercase hover:text-gray-500"
                >
                  See All Blocks
                </button>
              </div>
            </div>
            <div className="grid grid-rows gap-4 bg-white w-[48%] overflow-hidden">
              <div>
                <h1 className="px-2 py-4 font-medium tracking-wider text-[18px] border-[1px] shadow-inner">
                  Latest Transactions
                </h1>
                {filterTransactions.slice(0, 5).map((transaction, i) => (
                  <ul
                    key={i + 1}
                    className="px-2 py-4 border-[0.1px] shadow-inner tracking-wider"
                  >
                    <li>
                      TransactionId:{transaction.id}
                    </li>
                    <li>
                      From:{transaction.from.slice(0,30)}...
                    </li>
                    <li>To:{transaction.to.slice(0,30)}...</li>
                  </ul>
                ))}
                <button
                  onClick={() => router.push("/transactions")}
                  className="px-2 py-4 font-medium tracking-wider text-[18px] border-[1px] shadow-inner w-full uppercase hover:text-gray-500"
                >
                  See All Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
