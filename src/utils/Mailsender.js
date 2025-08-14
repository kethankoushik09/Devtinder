// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kethankoushik09@gmail.com", // your Gmail
    pass: "ekah eioc ofpc hbvr", // your Gmail app password
  },
});

const sendMail = async (to) => {
  try {
    const info = await transporter.sendMail({
      from: `null98@gmail.com`,
      to,
      subject:"kethankoushik09@gmail.com",
      text :"plz accept my request ",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
