import amqp from "amqplib";

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const queue = process.env.CLOUDMQP_QUEUE;

const run = () => {
  const open = amqp.connect(url);

  open
    .then(conn => {
      let ok = conn.createChannel();

      ok = ok.then(ch => {
        ch.assertQueue(queue);
        ch.consume(queue, msg => {
          msg && console.log(JSON.stringify(msg));
        });
      });
      return ok;
    })
    .then(null, console.warn);
};

run();
