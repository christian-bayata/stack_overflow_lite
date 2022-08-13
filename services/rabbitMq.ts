import amqp from "amqplib/callback_api";
import connectionString from "./connection";

let ch: any = null;
amqp.connect(connectionString, function (err, conn) {
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});

export const publishToQueue = async (queueName: string, data: any) => {
  ch.sendToQueue(queueName, Buffer.from(data), { persistent: true });
};

process.on("exit", () => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
