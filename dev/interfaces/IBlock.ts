export default interface IBlock {
   index: number;
   timestamp: number;
   transactions: any[];
   nonce: number;
   hash: string;
   previousBlockHash: string;
}