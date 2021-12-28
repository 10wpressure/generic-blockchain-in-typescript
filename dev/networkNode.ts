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
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
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
// send reward for the mined block
    bitcoin.createNewTransaction(12.5, '00', nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: 'New block mined successfully',
        block: newBlock,
    });
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

app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});