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
                         ${type === "alert"
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

const dueMailTemplate = ({ name, title, type, category, amount, date, time, note }) => {
     const isAlert = type === "alert";

     return `
          <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:30px;">
               <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(15,23,42,0.12);">
                    
                    <div style="background:${isAlert ? "#ef4444" : "#2563eb"};padding:24px 28px;color:#ffffff;">
                         <h2 style="margin:0;font-size:24px;font-weight:700;">
                              ${isAlert ? "Bill Alert Reminder" : "Reminder Notification"}
                         </h2>
                         <p style="margin:8px 0 0;font-size:14px;opacity:0.92;">
                              ${isAlert ? "Your bill/payment is coming due soon." : "Your scheduled reminder is coming due soon."}
                         </p>
                    </div>

                    <div style="padding:28px;">
                         <p style="font-size:16px;color:#0f172a;margin:0 0 12px;">
                              Hello <strong>${name || "User"}</strong>,
                         </p>

                         <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
                              ${isAlert
               ? "This is a reminder that your bill alert is near its due date/time. Please review the bill details and make the payment on time."
               : "This is a reminder that your scheduled reminder is near its due date/time. Please check the details below."
          }
                         </p>

                         <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:22px 0;">
                              <table style="width:100%;border-collapse:collapse;">
                                   <tr>
                                        <td style="padding:8px 0;color:#64748b;font-size:14px;">Title</td>
                                        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${title}
                                        </td>
                                   </tr>

                                   <tr>
                                        <td style="padding:8px 0;color:#64748b;font-size:14px;">Type</td>
                                        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${isAlert ? "Bill Alert" : "Reminder"}
                                        </td>
                                   </tr>

                                   <tr>
                                        <td style="padding:8px 0;color:#64748b;font-size:14px;">Category</td>
                                        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${category || "Other"}
                                        </td>
                                   </tr>

                                   ${isAlert
               ? `
                                                  <tr>
                                                       <td style="padding:8px 0;color:#64748b;font-size:14px;">Amount</td>
                                                       <td style="padding:8px 0;color:#ef4444;font-size:15px;font-weight:800;text-align:right;">
                                                            ₹ ${Number(amount || 0).toLocaleString("en-IN")}
                                                       </td>
                                                  </tr>
                                             `
               : ""
          }

                                   <tr>
                                        <td style="padding:8px 0;color:#64748b;font-size:14px;">Due Date</td>
                                        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${date}
                                        </td>
                                   </tr>

                                   <tr>
                                        <td style="padding:8px 0;color:#64748b;font-size:14px;">Due Time</td>
                                        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${time || "Not set"}
                                        </td>
                                   </tr>
                              </table>
                         </div>

                         ${note
               ? `
                                        <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
                                             <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.6;">
                                                  <strong>Note:</strong> ${note}
                                             </p>
                                        </div>
                                   `
               : ""
          }

                         <p style="font-size:14px;color:#64748b;line-height:1.7;margin:0;">
                              ${isAlert
               ? "Please take action before the due date to avoid missing your bill/payment."
               : "Please complete or review this reminder before the scheduled time."
          }
                         </p>
                    </div>

                    <div style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;">
                         <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                              This is an automated due notification from Spend Analyzer.
                         </p>
                    </div>
               </div>
          </div>
     `;
};


module.exports = {
     reminderMailTemplate,
     dueMailTemplate
};