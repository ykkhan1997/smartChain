const { keccakHash } = require("../util");
const _=require("lodash");
class Node{
    constructor(){
        this.value=null;
        this.childMap={};
    };
}
class Trie{
    constructor(){
        this.header=new Node();
        this.generateRootHash();
    }
    generateRootHash(){
        this.rootHash=keccakHash(this.header);
    }
    put({key,value}){
        let node=this.header;
        for(let character of key){
            if(!node.childMap[character]){
                node.childMap[character]=new Node();
            }
            node=node.childMap[character];
        }
        node.value=value;
        this.generateRootHash();
    }
    get({key}){
        let node=this.header;
        for(let character of key){
            if(node.childMap[character]){
                node=node.childMap[character];
            }
        }
        return _.cloneDeep(node.value);
    }
    static buildTrie({items}){
        const trie=new Trie();
        for(let item of items.sort((a,b)=>keccakHash(a)>keccakHash(b))){
            trie.put({key:keccakHash(item),value:item});
        }
        return trie;
    }
}
module.exports=Trie;