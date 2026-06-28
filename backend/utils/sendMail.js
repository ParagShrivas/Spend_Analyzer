const dns = require("dns");
const nodemailer = require("nodemailer");

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

// Check what Gmail resolves to on Railway
dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
     if (err) {
          console.error("DNS Lookup Error:", err);
     } else {
          console.log("SMTP DNS:", addresses);
     }
});

const transporter = nodemailer.createTransport({
     host: process.env.MAIL_HOST,
     port: Number(process.env.MAIL_PORT),
     secure: Number(process.env.MAIL_PORT) === 465,
     family: 4,
     auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
     },
     dnsTimeout: 30000,
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