import React, { useContext, useState } from "react";
import { smartChainContext } from "@/Context";
import { MineBlocks } from "@/Components";
import axios from "axios";
import { BASEURL } from "@/Context/config";
const Block = () => {
  const [replaceMessage, setReplaceMessage] = useState("");
  const requestPeer=async()=>{
    const response=await axios.get(`${BASEURL}/blockchain--peer`);
    const data=await response.data.message;
    setReplaceMessage(data);
  }
  const { getMineBlock, mineBlock } = useContext(smartChainContext);
  return (
    <div>
      <MineBlocks
        getMineBlock={getMineBlock}
        mineBlock={mineBlock}
        requestPeer={requestPeer}
        replaceMessage={replaceMessage}
      />
    </div>
  );
};

export default Block;
