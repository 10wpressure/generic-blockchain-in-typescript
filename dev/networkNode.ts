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
            data: { newNodeUrl: newNodeUrl},
        };
        regNodesPromises.push(axios(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {

        })
});

// used on other nodes when they receive broadcast with new node parameters
app.post('/register-node', (req, res) => {

});

// used on the new node to register all existing nodes in one package
app.post('register-nodes-bulk', (req, res) => {

});

app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});