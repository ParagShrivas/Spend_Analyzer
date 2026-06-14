const reminderMailTemplate = ({ name, title, type, category, amount, date, time, note }) => {
     return `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:30px;">
               <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;padding:25px;">
                    <h2 style="color:#2563eb;margin-top:0;">
                         ${type === "alert" ? "Bill Alert Created" : "Reminder Created"}
                    </h2>

                    <p>Hello ${name || "User"},</p>

                    <p>Your ${type === "alert" ? "bill alert" : "reminder"} has been created successfully.</p>

                    <div style="background:#f8fafc;border-radius:12px;padding:18px;margin:20px 0;">
                         <p><strong>Title:</strong> ${title}</p>
                         <p><strong>Category:</strong> ${category || "Other"}</p>
                         ${
                              type === "alert"
                                   ? `<p><strong>Amount:</strong> ₹ ${Number(amount || 0).toLocaleString("en-IN")}</p>`
                                   : ""
                         }
                         <p><strong>Date:</strong> ${date}</p>
                         <p><strong>Time:</strong> ${time || "Not set"}</p>
                         ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
                    </div>

                    <p style="color:#64748b;font-size:14px;">
                         You will receive notification updates based on your reminder or bill alert date.
                    </p>
               </div>
          </div>
     `;
};

module.exports = {
     reminderMailTemplate
};