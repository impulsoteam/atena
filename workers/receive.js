import userController from "../controllers/user";

const url = process.env.CLOUDAMQP_URL;
const queue = process.env.CLOUDMQP_QUEUE;

const run = async () => {
  if (url) {
    const { Connection } = require("amqplib-as-promised");
    const connection = new Connection(url);
    await connection.init();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    await channel.consume(queue, async msg => {
      if (msg !== null) {
        try {
          await userController.handleFromNext();
          console.log(msg.content.toString());
        } catch (err) {
          console.log(err);
        }
        channel.ack(msg);
      }
    });
    await channel.close();
    await connection.close();
  }
};

run();
