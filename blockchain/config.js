const GENESIS_DATA={
    blockHeaders:{
        parentHash:"--genesisParentHash--",
        benificiary:"--genesisBenificiary--",
        timestamp:"--genesisTimeStamp--",
        nonce:0,
        number:0,
        difficulty:1,
        transactionRoot:"--genesisTransactionRoot--",
        stateRoot:"--genesisStateRoot--"
    },
    transactionSeries:[]
}
const MILLI_SECONDS=1;
const SECONDS=1000*MILLI_SECONDS;
const MINE_RATE=13*SECONDS;
const STARTING_BALANCE=1000;
const MINING_REWARD=50;
let result;
module.exports={
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    MINING_REWARD,
    result
};