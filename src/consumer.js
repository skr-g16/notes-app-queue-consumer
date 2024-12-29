require('dotenv').config();

const amqp = require('amqplib');
const Listener = require('./Listener');
const MailSender = require('./MailSender');
const NotesServices = require('./NotesServices');

const init = async () => {
  const notesServices = new NotesServices();
  const mailSender = new MailSender();
  const listener = new Listener(notesServices, mailSender);
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  try {
    await channel.assertQueue('export:notes', {
      durable: true,
    });
  } catch (error) {
    console.log(error);
  }
  channel.consume('export:notes', listener.listen, { noAck: true });
};

init();
