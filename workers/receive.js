import userController from "../controllers/user";

const url = process.env.CLOUDAMQP_URL;
const queue = process.env.CLOUDMQP_QUEUE;

const bail = err => {
  console.error(err);
  process.exit(1);
};

const consumer = conn => {
  const on_open = (err, ch) => {
    if (err != null) bail(err);

    ch.assertQueue(queue, { durable: false });
    console.log("[*] Waiting for messages in %s.", queue);
    ch.consume(queue, async msg => {
      if (msg !== null) {
        console.log(msg.content.toString());
        try {
          await userController.handleFromNext(
            JSON.parse(msg.content.toString())
          );
        } catch (err) {
          console.error(err);
        }
        ch.ack(msg);
      }
    });
  };

  conn.createChannel(on_open);
};

const run = () => {
  if (url) {
    require("amqplib/callback_api").connect(url, (err, conn) => {
      if (err != null) bail(err);
      consumer(conn);
    });
  }
};

run();
