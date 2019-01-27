import amqp from "amqplib/callback_api";

amqp.connect(
  process.env.CLOUDAMQP_URL,
  (err, conn) => {
    if (err) return false;

    conn.createChannel((err, ch) => {
      if (err) return false;
      const q = "atena";

      ch.assertQueue(q, { durable: false });
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
      ch.consume(
        q,
        function(msg) {
          console.log(" [x] Received %s", msg.content.toString());
        },
        { noAck: true }
      );
    });
  }
);
