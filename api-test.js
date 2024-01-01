const request = require("request");
const BASE_URL = "http://localhost:3000";
const InterPreter=require("./Interpreter");
const {PUSH,ADD,STOP,STORE,LOAD,JUMP,JUMPI}=InterPreter.OPCODE_MAP;
const postTransact = ({ to, value,code,gasLimit }) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/transact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, value,code,gasLimit}),
      },
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};
const mineBlock = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(`${BASE_URL}/blockchain/mine`, (error, response, body) => {
        return resolve(JSON.parse(body));
      });
    }, 5000);
  });
};
const getAccountBalance=({address}={})=>{
    return new Promise((resolve,reject)=>{
        request(`${BASE_URL}/account/balance`+(address?`?address=${address}`:''),(error,response,body)=>{

            return resolve(JSON.parse(body));
        });
    });
}
let toAccountData;
let toSmartContractAccountData;
postTransact({})
  .then((postTransactResponse1) => {
    console.log("postTransactResponse1", postTransactResponse1);
    toAccountData = postTransactResponse1.transaction.data.accountData;
    console.log(JSON.stringify(toAccountData));
    return mineBlock();
  })
  .then((mineBlockResponse1) => {
    console.log("mineBlockResponse1", mineBlockResponse1);
    return postTransact({ to: toAccountData.address, value:230});
  })
  .then((postTransactResponse2) => {
    console.log("postTransactResponse2", postTransactResponse2);
    return mineBlock();
  })
  .then((mineBlockResponse2) => {
    console.log("mineBlockResponse2", mineBlockResponse2);
    const key='foo';
    const value='bar';
    const code=[PUSH,value,PUSH,key,STORE,PUSH,key,LOAD,STOP];
    return postTransact({code});
  })
  .then((postTransactResponse3)=>{
    console.log("postTransactResponse3",postTransactResponse3);
    toSmartContractAccountData=postTransactResponse3.transaction.data.accountData;
    return mineBlock();
  })
  .then((mineBlockResponse3)=>{
    console.log("mineBlockResponse3",mineBlockResponse3);
    return postTransact({to:toSmartContractAccountData.codeHash,value:0,gasLimit:100});
  })
  .then((postTransactResponse4)=>{
    console.log("postTransactResponse4",postTransactResponse4);
    return mineBlock();
  })
  .then((mineBlockResponse4)=>{
    console.log("mineBlockResponse4",mineBlockResponse4);
    return getAccountBalance();
  })
  .then((getAccountBalanceResponse1)=>{
    console.log("getAccountBalanceResponse1",getAccountBalanceResponse1);
    return getAccountBalance({address:toAccountData.address});
  })
  .then((getAccountBalanceResponse2)=>{
    console.log("getAccountBalanceResponse2",getAccountBalanceResponse2);
  });
