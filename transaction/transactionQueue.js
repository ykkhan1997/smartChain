class TransactionQueue{
    constructor(){
        this.TransactionQueueMap={};
    }
    add(transaction){
        this.TransactionQueueMap[transaction.id]=transaction;
    }
    getTransactionSeries(){
        return Object.values(this.TransactionQueueMap);
    }
    clearBlockTransactionSeries({transactionSeries}){
        for(let transaction of transactionSeries){
            delete this.TransactionQueueMap[transaction.id];
        }
    }
}
module.exports=TransactionQueue;