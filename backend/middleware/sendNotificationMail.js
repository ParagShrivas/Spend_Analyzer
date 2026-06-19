const sendMail = require("../utils/sendMail");
const { reminderMailTemplate } = require("../utils/mailTemplates");

const sendNotificationMail = async (req, res, next) => {
     try {
          const userEmail = req.user?.email || req.body.email;

          if (!userEmail) {
               console.log("No user email found. Skipping mail.");
               return next();
          }

          const { type, title, category, amount, notifyDate, notifyTime, note } = req.body;

          const subject =
               type === "alert"
                    ? `Bill Alert Created: ${title}`
                    : `Reminder Created: ${title}`;

          const html = reminderMailTemplate({
               name: req.user?.name,
               title,
               type,
               category,
               amount,
               date: notifyDate,
               time: notifyTime,
               note
          });

          const mailResult = await sendMail({
               to: userEmail,
               subject,
               html
          });

          req.mailResult = mailResult;

          next();
     } catch (error) {
          console.error("Notification mail middleware error:", error);

          /*
             Do not stop the main request if email fails.
             Reminder/alert should still be created.
          */
          next();
     }
};

module.exports = sendNotificationMail;