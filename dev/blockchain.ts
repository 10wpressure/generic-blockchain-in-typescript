const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
import { IBlock, ITransactions } from './interfaces/';

export class Blockchain {
    chain: IBlock[] = [];
    pendingTransactions: ITransactions[] = [];
    currentNodeUrl: string;
    networkNodes: string[] = [];

    constructor() {
        this.createNewBlock(100, '0', '0');
        this.currentNodeUrl = currentNodeUrl;
    }

    createNewBlock(nonce: number, previousBlockHash: string, hash: string): IBlock {
        const newBlock: IBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash,
        };
        this.pendingTransactions = [];

        this.chain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createNewTransaction(amount: number, sender: string, recipient: string): number {
        const newTransaction: ITransactions = {
            amount: amount,
            sender: sender,
            recipient: recipient,
        };

        this.pendingTransactions.push(newTransaction);

        return this.getLastBlock()['index'] + 1;
    }

    hashBlock(previousBlockHash: string, currentBlockData: {}, nonce: number) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        return sha256(dataAsString);
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    }
}