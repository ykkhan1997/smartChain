import React,{useContext} from 'react'
import { smartChainContext } from '@/Context';
import { Search } from '@/Components';
import Image from 'next/image';
import { Background } from '@/public';
const Block = () => {
  const {searchTerm,handleOnChange,hanldeClickSearch,filterBlockChain}=useContext(smartChainContext);
  return (
    <div>
      <div className=''>
        <Image src={Background} alt='backgroundImage' width={1400} height={400}/>
        <div className=''>
        <h1 className='mt-[-110px] ml-10 text-[18px] tracking-wide text-white font-medium'>The Ethereum Blockchain Explorer</h1>
        <Search searchTerm={searchTerm} onChange={handleOnChange}onClick={hanldeClickSearch}/>
        </div>
        <div className='grid grid-cols-3 gap-2 px-2 py-2'>
          {
            filterBlockChain.map((block,i)=>(
              <ul key={i+1} className='bg-gray-100 border-[1px] shadow-inner px-2 py-4 rounded mt-5 ml-2 text-black'>
                <li>parentHash:{block.blockHeaders.parentHash.slice(0,25)}</li>
                <li>Benificiary:{block.blockHeaders.benificiary.slice(0,25)}</li>
                <li>Timestamp:{block.blockHeaders.timestamp}</li>
                <li>Nonce:{block.blockHeaders.nonce}</li>
                <li>Number:{block.blockHeaders.number}</li>
                <li>Difficulty:{block.blockHeaders.difficulty}</li>
                <li>transactionRoot:{block.blockHeaders.transactionRoot.slice(0,25)}</li>
                <li>StateRoot:{block.blockHeaders.stateRoot.slice(0,25)}</li>
              </ul>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Block;