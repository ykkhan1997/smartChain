const keccak256=require("js-sha3").keccak256;
const Ec=require("elliptic").ec;
const ec=new Ec("secp256k1");
const sortCharacter=(data)=>{
    return JSON.stringify(data).split("").sort().join("");
}
const keccakHash=(data)=>{
    const hash=keccak256.create();
    hash.update(sortCharacter(data));
    return hash.hex();
}
module.exports={
    sortCharacter,
    keccakHash,
    ec
}