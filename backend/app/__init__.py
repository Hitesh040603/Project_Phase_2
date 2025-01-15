from flask import Flask, jsonify
from backend.blockchain.blockchain import Blockchain
from backend.pubsub import PubSub
import random
import os

app=Flask(__name__)
blockchain=Blockchain()
pubsub=PubSub(blockchain)

@app.route('/')
def default():
    return 'Welcome to blockchain'

@app.route('/blockchain')
def route_blockchain():
    return jsonify(blockchain.to_json())


@app.route('/blockchain/mine')
def route_blockchain_mine():
    transaction_data='stubbed_transaction'
    blockchain.add_block(transaction_data)

    block=blockchain.chain[-1]
    pubsub.broadcast_block(block)
    return jsonify(block.to_json())

PORT=5000

if os.environ.get('PEER')=='True':
    PORT=random.randint(5001,6000)


app.run(port=PORT)
