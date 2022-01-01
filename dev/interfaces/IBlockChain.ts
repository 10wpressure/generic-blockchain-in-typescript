import { IBlock, ITransactions } from './index';

export default interface IBlockChain {
    chain: IBlock[];
    pendingTransactions: ITransactions[];
    currentNodeUrl: string;
    networkNodes: string[];
}