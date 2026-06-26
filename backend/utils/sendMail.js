// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//      host: process.env.MAIL_HOST,
//      port: Number(process.env.MAIL_PORT),
//      secure: Number(process.env.MAIL_PORT) === 465,
//      auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS
//      }
// });

// const sendMail = async ({ to, subject, html }) => {
//      try {
//           const info = await transporter.sendMail({
//                from: `"${process.env.MAIL_FROM}" <${process.env.MAIL_USER}>`,
//                to,
//                subject,
//                html
//           });

//           return {
//                success: true,
//                messageId: info.messageId
//           };
//      } catch (error) {
//           console.error("Mail sending error:", error);

//           return {
//                success: false,
//                error: error.message
//           };
//      }
// };

// module.exports = sendMail;

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"${process.env.MAIL_FROM}" <onboarding@resend.dev>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Mail sending error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Mail sending error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;