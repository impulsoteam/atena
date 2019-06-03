const url = process.env.CLOUDAMQP_URL;
const queue = process.env.CLOUDMQP_QUEUE_OUT;

const bail = err => {
  console.error("[*] Error sending message", err);
  process.exit(1);
};

const publisher = (conn, data) => {
  const on_open = (err, ch) => {
    if (err != null) bail(err);
    const queueOpts = { persistent: true };
    const message = new Buffer(JSON.stringify(data));
    ch.assertExchange(queue, "fanout", { durable: false });
    ch.sendToQueue(queue, message, queueOpts);
    ch.publish(queue, "", message, queueOpts);
    console.log(" [x] Sended %s", JSON.stringify(data));
  };

  conn.createChannel(on_open);

  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
};

export const runPublisher = data => {
  if (url) {
    require("amqplib/callback_api").connect(url, (err, conn) => {
      if (err != null) bail(err);
      publisher(conn, data);
    });
  }
};
