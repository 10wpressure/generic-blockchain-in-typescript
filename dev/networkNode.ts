import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Blockchain } from './blockchain';
import { v1 as uuid } from 'uuid';
import { AxiosRequestConfig } from 'axios';

const axios = require('axios').default;

const nodeAddress = uuid().split('-').join('');
const app = express();
const port = process.argv[2];
const bitcoin = new Blockchain();

// used to parse req.body in post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// provides information for all the blocks and pending transactions
app.get('/blockchain', (req, res) => {
    res.send(bitcoin);
});

// add transaction to blockchain
app.post('/transaction', (req, res) => {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions: AxiosRequestConfig = {
            url: '/transaction',
            method: 'post',
            baseURL: networkNodeUrl,
            data: newTransaction,
        };
        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises)
        .then((data) => {
            res.json({ note: 'Transaction was created and broadcast successfully.' });
        })
        .catch((error) => {
            console.log(error);
        });
});

// mine new block
app.get('/mine', (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1,
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions: AxiosRequestConfig = {
            url: '/receive-new-block',
            method: 'post',
            baseURL: networkNodeUrl,
            data: { newBlock: newBlock },
        };
        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises)
        .then(() => {
            const requestOptions: AxiosRequestConfig = {
                url: '/transaction/broadcast',
                method: 'post',
                baseURL: bitcoin.currentNodeUrl,
                data: {
                    amount: 12.5,
                    sender: '00',
                    recipient: nodeAddress,
                },
            };
            return axios(requestOptions);
        })
        .then(() => {
            res.json({
                note: 'New block mined successfully',
                block: newBlock,
            });
        })
        .catch((error: any) => {
            console.error(error);
        });
});

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: `New block received and accepted.`,
            newBlock: newBlock,
        });
    } else {
        res.json({
            note: `New block was rejected.`,
            newBlock: newBlock,
        });
    }
});

// register new node and broadcast information to other registered nodes
app.post('/register-and-broadcast-node', (req, res) => {
    const newNodeUrl: string = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions: AxiosRequestConfig = {
            url: '/register-node',
            method: 'post',
            baseURL: networkNodeUrl,
            data: { newNodeUrl: newNodeUrl },
        };
        regNodesPromises.push(axios(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then((data) => {
            const bulkRegisterOptions: AxiosRequestConfig = {
                url: '/register-nodes-bulk',
                method: 'post',
                baseURL: newNodeUrl,
                data: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
            };
            return axios(bulkRegisterOptions);
        })
        .then((data) => {
            res.json({ note: 'New node registered with network succesfully' });
        })
        .catch((error) => {
            console.log(error);
        });
});

// used on other nodes when they receive broadcast with new node parameters
app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' });
});

// used on the new node to register all existing nodes in one package
app.post('/register-nodes-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach((networkNodeUrl) => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'Bulk registration is successfull.' });
});

app.get('/consensus', (req, res) => {
    const requestPromises = [];
    bitcoin.networkNodes.forEach((networkNodeUrl) => {
        const requestOptions: AxiosRequestConfig = {
            url: '/blockchain',
            method: 'get',
            baseURL: networkNodeUrl,
        };

        requestPromises.push(axios(requestOptions));
    });
    Promise.all(requestPromises)
        .then(blockchains => {
            let maxChainLength = bitcoin.chain.length;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                }
            });

            if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: bitcoin.chain,
                });
            } else if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: bitcoin.chain,
                })
            }
        })
        .catch(error => console.log(error));
});

app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});