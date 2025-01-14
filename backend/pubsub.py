from pubnub.pubnub import PubNub
from pubnub.pnconfiguration import PNConfiguration
from pubnub.callbacks import SubscribeCallback
import time


pnconfig=PNConfiguration()
pnconfig.subscribe_key='sub-c-b4c58c18-1c1a-4126-a572-8b742e73508b'
pnconfig.publish_key='pub-c-a12ece30-0d71-4969-b471-dbdd395da481'

pubnub=PubNub(pnconfig)

TEST_CHANNEL='TEST_CHANNEL'

pubnub.subscribe().channels([TEST_CHANNEL]).execute()

class Listener(SubscribeCallback):
    def message(self, pubnub, message_object):
        print(f'\n-- Incoming message object: {message_object}')
        
pubnub.add_listener(Listener())

def main():
    time.sleep(1)
    pubnub.publish().channel(TEST_CHANNEL).message({'foo':'bar'}).sync()

if __name__=='__main__':
    main()

