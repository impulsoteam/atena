const url = process.env.CLOUDAMQP_URL;
const queue = process.env.CLOUDMQP_QUEUE;

const bail = err => {
  console.error(err);
  process.exit(1);
};

const publisher = (conn, user) => {
  const on_open = (err, ch) => {
    if (err != null) bail(err);

    ch.assertQueue(queue, { durable: false });
    console.log("[*] Waiting for messages in %s.", queue);
    ch.publish(queue, user, res => {
      if (res) {
        console.log(res.content.toString());
      } else {
        console.error("[*] Error sending message", res.toString());
      }
    });
  };

  conn.createChannel(on_open);
};

export const runPublisher = user => {
  if (url) {
    require("amqplib/callback_api").connect(
      url,
      (err, conn) => {
        if (err != null) bail(err);
        publisher(conn, user);
      }
    );
  }
};
