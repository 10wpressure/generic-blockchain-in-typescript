import { AxiosRequestConfig, default as axios } from 'axios';
import { IBlock, IBlockChain } from './interfaces';

const regAndBroadcastUrl = `http://localhost:3001/register-and-broadcast-node`;

const dev = async () => {
    const axios = require('axios').default;

   const regNode2 =  await axios.post(regAndBroadcastUrl,
        {
            'newNodeUrl': 'http://localhost:3002',
        },
    );

    const regNode3 =await axios.post(regAndBroadcastUrl,
        {
            'newNodeUrl': 'http://localhost:3003',
        },
    );

    const regNode4 = await axios.post(regAndBroadcastUrl,
        {
            'newNodeUrl': 'http://localhost:3004',
        },
    );

    const mineBlock1 = await axios.get(`http://localhost:3001/mine`);
    const mineBlock2 = await axios.get(`http://localhost:3002/mine`);
    const mineBlock3 = await axios.get(`http://localhost:3003/mine`);
    const getBlock3 = await axios.get(`http://localhost:3003/blockchain`);

    const regNode5 = await axios.post(regAndBroadcastUrl,
        {
            'newNodeUrl': 'http://localhost:3005',
        },
    );

    const node5consensus = await axios.get(`http://localhost:3005/consensus`)

    return node5consensus
};

dev().then(result => console.log(result.data.note))
    .catch((err: any) => {
    console.log(err);
});