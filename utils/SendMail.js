import nodemailer from 'nodemailer';
import logger from './logger.js';

export default function SendMail() {
  const transporter = nodemailer.createTransport({
    host: process.env.NM_HOST,
    port: process.env.NM_PORT,
    auth: {
      user: process.env.NM_USER,
      pass: process.env.NM_PASS,
    },
  });

  var mailOptions = {
    from: '"Employees-CRUD (sample)" <testingmail@example.app>',
    to: 'resourcestack1@gmail.com',
    subject: 'Nice Nodemailer test',
    text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
    html: "<b>Hey there! </b><br> You've been registered with us.",
  };

  return transporter.sendMail(mailOptions, function (err) {
    if (err) throw new Error(`Error sending mail ${err}`);
    else logger.info('Email sent successfully');
  });
}
