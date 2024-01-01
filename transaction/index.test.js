const Transaction=require("./index");
const Account=require("../account");
const State = require("../store/state");

describe("Transaction",()=>{
    let account,standardTransaction,createAccountTransaction,miningRewardTransaction,state,toAccount;
    beforeEach(()=>{
        state=new State();
        account=new Account();
        toAccount=new Account();
        state.putAccount({address:account.address,accountData:account});
        state.putAccount({address:toAccount.address,accountData:toAccount});
        standardTransaction=Transaction.createTransaction({account,to:toAccount.address,value:50});
        createAccountTransaction=Transaction.createTransaction({account});
        miningRewardTransaction=Transaction.createTransaction({benificiary:account.address});

    });
    describe("validateStandardTransaction()",()=>{
        it("validate a standardTransaction",()=>{
            expect(Transaction.validateStandardTransaction({state,transaction:standardTransaction})).resolves;
        });
        it("doesnot validate a malformed transaction",()=>{
            standardTransaction.to="different-recipient";
            expect(Transaction.validateStandardTransaction({state,transaction:standardTransaction})).rejects.toMatchObject(/invalid signature/);
        });
        it("doesnot validate if the value exceed the balance",()=>{
            standardTransaction=Transaction.createTransaction({account,to:toAccount.address,value:9001});
            expect(Transaction.validateStandardTransaction({transaction:standardTransaction})).rejects.toMatchObject(/exceeds balance/)
        });
        it("doesnot validte if the toAccount doesnot exist",()=>{
            standardTransaction=Transaction.createTransaction({account,to:"foo-recipient",value:50});
            expect(Transaction.validateStandardTransaction({transaction:standardTransaction})).rejects.toMatchObject(/doesnot exist/);
        });
        it("doesnot validate if the gasLimit exceed the balance",()=>{
            const codeHash='foo-hash';
            const code=["PUSH",1,"PUSH",2,"ADD","STOP"];
            state.putAccount({address:codeHash,accountData:{code,codeHash}});
            standardTransaction=Transaction.createTransaction({account,to:codeHash,gasLimit:9001});
            expect(Transaction.validateStandardTransaction({transaction:standardTransaction})).rejects.toMatchObject(/exceeds/)
        });
        it("doesnot validate if the gasUsed for the code exceed the gasLimit",()=>{
            const codeHash='foo-hash';
            const code=['PUSH',2,'PUSH',3,'ADD','STOP'];
            state.putAccount({address:codeHash,accountData:{code,codeHash}});
            standardTransaction=Transaction.createTransaction({account,to:codeHash,gasLimit:0});
            expect(Transaction.validateStandardTransaction({transaction:standardTransaction})).rejects.toMatchObject(/Transaction need more gas/);
        });
    });
    describe("validateCreateAccountTransaction()",()=>{
        it("validate a createAccount transaction",()=>{
            expect(Transaction.validateCreateAccountTransaction({transaction:createAccountTransaction})).resolves;
        });
        it("doesnot validate a non createAccount Transaction",()=>{
            expect(Transaction.validateCreateAccountTransaction({transaction:standardTransaction})).rejects.toMatchObject(/incorrect number of fields/)
        });
    });
    describe("validateMiningRewardTransaction()",()=>{
        it("validate a mining reward transaction",()=>{
            expect(Transaction.validateMiningRewardTransaction({transaction:miningRewardTransaction})).resolves;
        });
        it("doesnot validate a mining reward transaction",()=>{
            miningRewardTransaction.value=100
            expect(Transaction.validateMiningRewardTransaction({transaction:miningRewardTransaction})).rejects.toMatchObject(/doesnot match/);
        });
    });
});