import { Blockchain } from './blockchain';

const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1640877902577,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1640877941087,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1640878021017,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "a8887f00698411ecad6aff19d89fb94d",
                    "transactionId": "bf7ef1d0698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 666,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "e0d2e580698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 111,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "e2edd640698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 222,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "e4c862a0698411ecad6aff19d89fb94d"
                }
            ],
            "nonce": 15752,
            "hash": "000074de8f5b7c17b65257744ce2132646f816cfb4d35f47e9f9bae5e652210d",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1640878061452,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "a8887f00698411ecad6aff19d89fb94d",
                    "transactionId": "ef214fa0698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 333,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "fbdfa3e0698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 33443,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "fdd8dbd0698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 66,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "ffe63800698411ecad6aff19d89fb94d"
                },
                {
                    "amount": 777,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "01b18220698511ecad6aff19d89fb94d"
                }
            ],
            "nonce": 11248,
            "hash": "000012bd872a116c3ad98643c1dcbbc70cba0ae624f89519728125b54fb178de",
            "previousBlockHash": "000074de8f5b7c17b65257744ce2132646f816cfb4d35f47e9f9bae5e652210d"
        },
        {
            "index": 5,
            "timestamp": 1640878088752,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "a8887f00698411ecad6aff19d89fb94d",
                    "transactionId": "073b5ae0698511ecad6aff19d89fb94d"
                },
                {
                    "amount": 33,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "0ff36920698511ecad6aff19d89fb94d"
                },
                {
                    "amount": 22,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "116cc2b0698511ecad6aff19d89fb94d"
                }
            ],
            "nonce": 10194,
            "hash": "00007903b728b40e452489abdd514d2b272a6f0bd6b56987f5ca5d9c4d382392",
            "previousBlockHash": "000012bd872a116c3ad98643c1dcbbc70cba0ae624f89519728125b54fb178de"
        },
        {
            "index": 6,
            "timestamp": 1640878120063,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "a8887f00698411ecad6aff19d89fb94d",
                    "transactionId": "1780da10698511ecad6aff19d89fb94d"
                },
                {
                    "amount": 4,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "266542a0698511ecad6aff19d89fb94d"
                },
                {
                    "amount": 1,
                    "sender": "GLFGFO5SG546H42G4HJ5J6K7O",
                    "recipient": "GDBJ6GL902KGF5GSDG44SG420",
                    "transactionId": "27f139d0698511ecad6aff19d89fb94d"
                }
            ],
            "nonce": 43392,
            "hash": "00003ad8bd7801d5433be1832bbb6368ba975178fc942d2838b43bb45930dc34",
            "previousBlockHash": "00007903b728b40e452489abdd514d2b272a6f0bd6b56987f5ca5d9c4d382392"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "a8887f00698411ecad6aff19d89fb94d",
            "transactionId": "2a2aaf10698511ecad6aff19d89fb94d"
        }
    ],
    "networkNodes": [],
    "currentNodeUrl": "http://localhost:3001"
}

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));