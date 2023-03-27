import nodemailer from 'nodemailer';

export default function SendMail(email, subject, htmlMessage) {
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
    to: email,
    subject: subject,
    // text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
    html: htmlMessage,
  };

  return transporter.sendMail(mailOptions);

  // return transporter.sendMail(mailOptions, function (err) {
  //   if (err) throw new Error(`Error sending mail ${err}`);
  //   else logger.info('Email sent successfully');
  // });
}
