import time
from backend.util.crypto_hash import crypto_hash
from backend.config import MINE_RATE

GENESIS_DATA={
    'timestamp':1,
    'last_hash': 'genesis_last_hash',
    'hash':'genesis_hash',
    'data': [],
    'difficulty':3,
    'nonce':'genesis_nonce'
}

class Block:
    def __init__(self,timestamp,last_hash,hash,data,difficulty,nonce):
        self.timestamp=timestamp
        self.data=data
        self.last_hash=last_hash
        self.hash=hash
        self.nonce=nonce
        self.difficulty=difficulty



    def __repr__(self):
        return (f'Block('
                f'timestamp: {self.timestamp}, '
                f'hash: {self.hash}, '
                f'last_hash: {self.last_hash}, '
                f'data: {self.data}, '
                f'nonce: {self.nonce}, '
                f'difficulty: {self.difficulty})')

    @staticmethod
    def mine_block(last_block,data):
        """"
        Mines block based on given last block and data
        until blockhash meets leading zeroes PoW requirement
        """
        timestamp=time.time_ns()
        last_hash=last_block.hash

        difficulty=last_block.adjust_difficulty(last_block,timestamp)
        nonce=0

        hash=crypto_hash(timestamp,last_hash,data,difficulty,nonce)
        while hash[0:difficulty]!= '0'*difficulty:
            nonce+=1
            timestamp=time.time_ns()
            difficulty=last_block.adjust_difficulty(last_block,timestamp)

            hash=crypto_hash(timestamp,last_hash,data,difficulty,nonce)

        return Block(timestamp,last_hash,hash,data,difficulty,nonce)
    
    @staticmethod
    def genesis():
        """
        Generates genesis Block
        """
        return Block(**GENESIS_DATA)

    @staticmethod
    def adjust_difficulty(last_block,new_timestamp):
        """
        Calculate adjusted difficulty according to MINE_RATE
        Increase if too easy
        Decrease if too difficult
        """
        if (new_timestamp-last_block.timestamp)<MINE_RATE:
            return last_block.difficulty+1
        if last_block.difficulty>1:
            return last_block.difficulty-1
        return 1

    

def main():
    print(f'block.py __name__:{__name__}')
    genesis_block=Block.genesis()
    block=Block.mine_block(genesis_block,'foo')
    print(block)


if __name__=='__main__':
    main()