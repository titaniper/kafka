import { Kafka } from 'kafkajs';

const brokers = [`localhost:62001`]

const kafka = new Kafka({
  clientId: 'kafkajs-consumer',
  brokers,
})

const consumer = kafka.consumer({ 
  groupId: 'test-group',
  // groupId: string
  // partitionAssigners?: PartitionAssigner[]
  // metadataMaxAge?: number
  // sessionTimeout?: number
  // rebalanceTimeout?: number
  // heartbeatInterval?: number
  // maxBytesPerPartition?: number
  // minBytes?: number
  // maxBytes?: number
  // maxWaitTimeInMs?: number
  // retry?: RetryOptions & { restartOnFailure?: (err: Error) => Promise<boolean> }
  retry: {
    retries: 2
  },
  // allowAutoTopicCreation?: boolean
  // maxInFlightRequests?: number
  // readUncommitted?: boolean
  // rackId?: string
})

const run = async () => {
  // Consuming
  await consumer.connect()
  // test-unsubscribing-topic-group2, test-unsubscribing-topic-group 
  await consumer.subscribe({ topics: [
    // 'test_unsubscribing_topic', 
    'test-topic',
  ], fromBeginning: true })


  // await consumer.

  await consumer.run({
    // autoCommit?: boolean
    // autoCommitInterval?: number | null
    // autoCommitThreshold?: number | null
    // eachBatchAutoResolve?: boolean
    // partitionsConsumedConcurrently?: number
    // eachBatch?: EachBatchHandler
    // eachMessage?: EachMessageHandler
    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
      console.log('batch!!!!: ', batch, {resolveOffset, heartbeat, isRunning, isStale});
    },
    eachMessage: async ({ topic, partition, message }: { topic: any; partition: any; message: any}) => {
      if (message.value.toString() === 'test') {
        throw Error('test');
      }
      // 
      // console.log('topic!!!!: ', topic, message);
      console.log('hi', {
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)