const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  // Configure your SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use 'Outlook', 'Yahoo', etc., or configure with `host`, `port`, and `auth`
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email app password
    },
  });

  const mailOptions = {
    from: `"CampusVault" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
