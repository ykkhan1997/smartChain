const State = require("../store/state");
const { keccakHash } = require("../util");
const Block=require("./block");
describe("Block",()=>{
    describe("calculateBlockTargetHash()",()=>{
        it("calculate the maximum hash value when the last block difficulty is low",()=>{
            expect(Block.calculateBlockTargetHash({lastBlock:{blockHeaders:{difficulty:1}}}))
            .toEqual("f".repeat(64));
        });
        it("calculate the low hash value when the difficulty is high",()=>{
            expect(Block.calculateBlockTargetHash({lastBlock:{blockHeaders:{difficulty:500}}})
            <"1"
            ).toBe(true);
        })
    });
    describe("adjustDifficulty()",()=>{
        it("keep the difficulty above 0",()=>{
            expect(Block.adjustDifficulty({lastBlock:{blockHeaders:{difficulty:0}},timestamp:Date.now()})).toEqual(1);
        });
        it("increase the difficulty for qucikly mined blocks",()=>{
            expect(Block.adjustDifficulty({lastBlock:{blockHeaders:{difficulty:4,timestamp:1000}},timestamp:2000})).toEqual(5);
        });
        it("decrease the difficulty for slowly mined blocks",()=>{
            expect(Block.adjustDifficulty({lastBlock:{blockHeaders:{difficulty:5,timestamp:1000}},timestamp:20000})).toEqual(4);
        });
    });
    describe("minedBlock()",()=>{
        let lastBlock,minedBlock;
        beforeEach(()=>{
            lastBlock=Block.genesis();
            minedBlock=Block.minedBlock({lastBlock,benificiary:"foo",transactionSeries:[]});
        });
        it("mine a block",()=>{
            expect(minedBlock).toBeInstanceOf(Block);
        });
        it("mine a block that meet the proof of work requirement",()=>{
            const target=Block.calculateBlockTargetHash({lastBlock});
            const {blockHeaders}=lastBlock;
            const {nonce}=blockHeaders;
            const truncatedBlockHeaders={...blockHeaders};
            delete truncatedBlockHeaders.nonce;
            const headers=keccakHash(truncatedBlockHeaders);
            const underTargetHash=keccakHash(headers+nonce);
            expect(underTargetHash<target).toBe(true);
        });
    });
    describe("validateBlock()",()=>{
        let lastBlock,block,state;
        beforeEach(()=>{
            lastBlock=Block.genesis();
            block=Block.minedBlock({lastBlock,benificiary:"benificiary",transactionSeries:[]});
            state=new State();
        });
        it("resolves if the block is the genesis block",()=>{
            expect(Block.validateBlock({block:Block.genesis()})).resolves;
        });
        it("resolve if the block is valid",()=>{
            expect(Block.validateBlock({lastBlock,block,state})).resolves;
        })
        it("rejects if the parentHash is invalid",()=>{
            block.blockHeaders.parentHash="foo";
            expect(Block.validateBlock({lastBlock,block,state})).rejects.toMatchObject(/parentHash of last block headers/);
        });
        it("rejects if the block is not increment the number by 1",()=>{
            block.blockHeaders.number=500;
            expect(Block.validateBlock({lastBlock,block,state})).rejects.toMatchObject({message:"The block must only increment the number by 1"});
        });
        it("rejects if the block difficulty is greater than 1",()=>{
            block.blockHeaders.difficulty=5;
            expect(Block.validateBlock({lastBlock,block,state})).rejects.toMatchObject({message:"The block difficulty must only adjust by 1"});
        });
        it("doesnot validate if the block doesnot meet the proof of work requirement",()=>{
            const originalBlockTargetHash=Block.calculateBlockTargetHash;
            Block.calculateBlockTargetHash=()=>{
                return "0".repeat(64);
            }
            expect(Block.validateBlock({lastBlock,block,state})).rejects.toMatchObject({message:"The block doesnot meet the proof of work requirements"});
            Block.calculateBlockTargetHash=originalBlockTargetHash;
        });
        it("doesnot validate if the transactionseries is not valid",()=>{
            block.transactionSeries="foo";
            expect(Block.validateBlock({lastBlock,block,state})).rejects.toMatchObject(/doesnot match/)
        });
    });
});