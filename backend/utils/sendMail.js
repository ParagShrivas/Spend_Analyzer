const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
     host: process.env.MAIL_HOST,
     port: 465,
     secure: true,
     family: 4,
     auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
     },
     connectionTimeout: 30000,
     greetingTimeout: 30000,
     socketTimeout: 30000,
});

const sendMail = async ({ to, subject, html }) => {
     try {
          const info = await transporter.sendMail({
               from: `"${process.env.MAIL_FROM}" <${process.env.MAIL_USER}>`,
               to,
               subject,
               html
          });

          return {
               success: true,
               messageId: info.messageId
          };
     } catch (error) {
          console.error("Mail sending error:", error);

          return {
               success: false,
               error: error.message
          };
     }
};

module.exports = sendMail;