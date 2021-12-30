const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
import { IBlock, ITransactions } from './interfaces/';
import { v1 as uuid } from 'uuid';

export class Blockchain {
    chain: IBlock[] = [];
    pendingTransactions: ITransactions[] = [];
    currentNodeUrl: string;
    networkNodes: string[] = [];

    constructor() {
        this.createNewBlock(100, '0', '0');
        this.currentNodeUrl = currentNodeUrl;
    }

    createNewBlock(
        nonce: number,
        previousBlockHash: string,
        hash: string,
    ): IBlock {
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

    createNewTransaction(
        amount: number,
        sender: string,
        recipient: string,
    ): ITransactions {
        return {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuid().split('-').join(''),
        };
    }

    addTransactionToPendingTransactions(transactionObj): number {
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()['index'] + 1;
    }

    hashBlock(previousBlockHash: string, currentBlockData: {}, nonce: number) {
        const dataAsString =
            previousBlockHash +
            nonce.toString() +
            JSON.stringify(currentBlockData);
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

    chainIsValid(blockchain): boolean {
        let validChain = true;

        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(
                previousBlock['hash'],
                {
                    transactions: currentBlock['transactions'],
                    index: currentBlock['index'],
                },
                currentBlock['nonce'],
            );

            if (blockHash.substring(0, 4) !== '0000') {
                validChain = false;
            }
            if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {
                validChain = false;
            }

            console.log('previousBlockHash =>', previousBlock['hash']);
            console.log('currentBlockHash =>', currentBlock['hash']);
        }
        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash =
            genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        if (
            !correctNonce ||
            !correctPreviousBlockHash ||
            !correctHash ||
            !correctTransactions
        ) {
            validChain = false;
        }
        return validChain;
    }
}
