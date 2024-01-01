import React,{useContext} from 'react'
import { smartChainContext } from '@/Context';
import { Search } from '@/Components';
import Image from 'next/image';
import { Background } from '@/public';
const Block = () => {
  const {searchTerm,handleOnChange,hanldeClickSearch,filterTransactions}=useContext(smartChainContext);
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
            filterTransactions.map((transaction,i)=>(
              <ul key={i+1} className='bg-gray-100 border-[1px] shadow-inner px-2 py-4 rounded mt-5 ml-2 text-black'>
                <li>TransactionId:{transaction.id}</li>
                <li>From:{transaction.from.slice(0,30)}...{transaction.from.slice(-4)}</li>
                <li>To:{transaction.to.slice(0,30)}...{transaction.to.slice(-4)}</li>
                <li>Value:{transaction.value}</li>
                <li>Data:{transaction.data.type}</li>
                <li>Address:{transaction.data.accountData?.address.slice(0,30)}{transaction.data.accountData?.address.slice(-4)}</li>
              </ul>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Block;