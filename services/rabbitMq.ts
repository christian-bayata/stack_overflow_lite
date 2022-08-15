import amqp from "amqplib/callback_api";
import connectionString from "./connection";

let ch: any = null;
amqp.connect(connectionString, function (err: any, conn: any) {
  conn.createChannel(function (err: any, channel: any) {
    ch = channel;
  });
});

export const publishToQueue = async (queueName: string, data: any) => {
  return ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
};

process.on("exit", () => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
