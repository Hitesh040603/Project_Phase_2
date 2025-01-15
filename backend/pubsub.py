from pubnub.pubnub import PubNub
from pubnub.pnconfiguration import PNConfiguration
from pubnub.callbacks import SubscribeCallback
import time


pnconfig=PNConfiguration()
pnconfig.subscribe_key='sub-c-b4c58c18-1c1a-4126-a572-8b742e73508b'
pnconfig.publish_key='pub-c-a12ece30-0d71-4969-b471-dbdd395da481'


TEST_CHANNEL='TEST_CHANNEL'


class Listener(SubscribeCallback):
    def message(self, pubnub, message_object):
        print(f'\n-- Channel: {message_object.channel} | Message: {message_object.message}')
        


class PubSub():
    """
    Handles pub/sub layer of application
    Provides communication between nodes of Blockchain
    """
    def __init__(self):
        self.pubnub=PubNub(pnconfig)
        self.pubnub.subscribe().channels([TEST_CHANNEL]).execute()
        self.pubnub.add_listener(Listener())

    def publish(self,channel,message):
        """
        Publishes message object to channel
        """
        self.pubnub.publish().channel(channel).message(message).sync()






def main():
    pubsub=PubSub()


    time.sleep(1)
    pubsub.publish(TEST_CHANNEL,{'foo':'bar'})

if __name__=='__main__':
    main()

