from backend.blockchain.block import Block
class Blockchain:
    
    def __init__(self):
        self.chain=[Block.genesis()]

    def add_block(self,data):
        self.chain.append(Block.mine_block(self.chain[-1],data))#self.chain[-1] references the last block in the chain
    

    def __repr__(self):
        return f'Blockchain: {self.chain}'
    

    @staticmethod
    def is_valid_chain(chain):
        """
        Validate the incoming chain
        Enforce following rules:
        1. Starts with genesis block
        2. Blocks format must be crct
        """
        if chain[0]!=Block.genesis():
            raise Exception('Genesis block must be valid')

        for i in range(1,len(chain)):
            block=chain[i]
            last_block=chain[i-1]
            Block.is_valid_block(last_block,block)

    
def main():

    blockchain=Blockchain()

    blockchain.add_block('one')
    blockchain.add_block('two')

    print(blockchain)


    print(f'block.py __name__:{__name__}')
if __name__=='__main__':
    main()