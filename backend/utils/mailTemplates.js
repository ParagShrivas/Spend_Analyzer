const loginOtpMailTemplate = ({ name, otp }) => {
     return `
          <!DOCTYPE html>
          <html>
          <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               <title>Login Verification</title>
          </head>

          <body style="margin:0;padding:0;background:#f4f9ff;font-family:Arial,Helvetica,sans-serif;">
               <div style="padding:35px 16px;background:#f4f9ff;">
                    <div style="
                         max-width:560px;
                         margin:0 auto;
                         overflow:hidden;
                         border-radius:22px;
                         background:#ffffff;
                         box-shadow:0 12px 35px rgba(14,165,233,0.16);
                    ">
                         
                         <div style="
                              padding:28px 30px;
                              background:linear-gradient(135deg,#38bdf8,#0ea5e9);
                              color:#ffffff;
                         ">
                              <div style="
                                   width:46px;
                                   height:46px;
                                   line-height:46px;
                                   text-align:center;
                                   margin-bottom:14px;
                                   border-radius:14px;
                                   background:rgba(255,255,255,0.2);
                                   font-size:22px;
                              ">
                                   🔐
                              </div>

                              <h1 style="
                                   margin:0;
                                   font-size:25px;
                                   font-weight:800;
                              ">
                                   Verify your login
                              </h1>

                              <p style="
                                   margin:8px 0 0;
                                   color:rgba(255,255,255,0.88);
                                   font-size:14px;
                                   line-height:1.6;
                              ">
                                   A secure sign-in request was received for your Spend Analyzer account.
                              </p>
                         </div>

                         <div style="padding:30px;">
                              <p style="
                                   margin:0;
                                   color:#334155;
                                   font-size:15px;
                                   line-height:1.7;
                              ">
                                   Hello <strong>${name || "User"}</strong>,
                              </p>

                              <p style="
                                   margin:12px 0 0;
                                   color:#64748b;
                                   font-size:14px;
                                   line-height:1.7;
                              ">
                                   Use the verification code below to complete your login. Enter this code in the Spend Analyzer verification popup.
                              </p>

                              <div style="
                                   margin:25px 0;
                                   padding:22px 16px;
                                   border:1px dashed #7dd3fc;
                                   border-radius:16px;
                                   background:#f0f9ff;
                                   text-align:center;
                              ">
                                   <div style="
                                        margin-bottom:8px;
                                        color:#64748b;
                                        font-size:11px;
                                        font-weight:800;
                                        letter-spacing:1.4px;
                                   ">
                                        YOUR LOGIN CODE
                                   </div>

                                   <div style="
                                        color:#0284c7;
                                        font-size:34px;
                                        font-weight:800;
                                        letter-spacing:10px;
                                   ">
                                        ${otp}
                                   </div>
                              </div>

                              <div style="
                                   display:flex;
                                   gap:12px;
                                   padding:15px;
                                   border-radius:14px;
                                   background:#fff7ed;
                                   border:1px solid #fed7aa;
                              ">
                                   <div style="
                                        font-size:18px;
                                        line-height:1.3;
                                   ">
                                        ⚠️
                                   </div>

                                   <div>
                                        <strong style="
                                             display:block;
                                             margin-bottom:4px;
                                             color:#c2410c;
                                             font-size:13px;
                                        ">
                                             Keep your code private
                                        </strong>

                                        <span style="
                                             color:#9a3412;
                                             font-size:12px;
                                             line-height:1.6;
                                        ">
                                             This code expires in 10 minutes. Never share it with anyone, including anyone claiming to be from Spend Analyzer.
                                        </span>
                                   </div>
                              </div>

                              <p style="
                                   margin:23px 0 0;
                                   color:#64748b;
                                   font-size:13px;
                                   line-height:1.7;
                              ">
                                   Didn’t request this login? You can safely ignore this email. Your account remains protected.
                              </p>
                         </div>

                         <div style="
                              padding:18px 30px;
                              border-top:1px solid #e2edf7;
                              background:#f8fbff;
                              text-align:center;
                         ">
                              <p style="
                                   margin:0;
                                   color:#94a3b8;
                                   font-size:12px;
                                   line-height:1.6;
                              ">
                                   © 2026 Spend Analyzer · Secure expense tracking made simple
                              </p>

                              <p style="
                                   margin:6px 0 0;
                                   color:#0ea5e9;
                                   font-size:12px;
                                   font-weight:700;
                              ">
                                   contact@domain.com
                              </p>
                         </div>
                    </div>
               </div>
          </body>
          </html>
     `;
};

const escapeHtml = (value = "") => {
     return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
};

const formatCurrency = (amount) => {
     return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};

const reminderMailTemplate = ({
     name,
     title,
     type,
     category,
     amount,
     date,
     time,
     note,
}) => {
     const isAlert = type === "alert";

     const safeName = escapeHtml(name || "User");
     const safeTitle = escapeHtml(title);
     const safeCategory = escapeHtml(category || "Other");
     const safeDate = escapeHtml(date);
     const safeTime = escapeHtml(time || "Not set");
     const safeNote = escapeHtml(note);

     const primaryColor = isAlert ? "#ef4444" : "#2563eb";
     const softColor = isAlert ? "#fef2f2" : "#eff6ff";
     const statusText = isAlert ? "Bill Alert Created" : "Reminder Created";
     const typeText = isAlert ? "Bill Alert" : "Reminder";

     return `
          <div style="margin:0;padding:32px 15px;background:#eef3f9;font-family:Arial,Helvetica,sans-serif;">
               <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.12);">

                    <div style="background:linear-gradient(135deg,${primaryColor},${isAlert ? "#b91c1c" : "#1d4ed8"});padding:34px 30px;color:#ffffff;">
                         <div style="display:inline-block;background:rgba(255,255,255,0.18);padding:7px 12px;border-radius:30px;font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">
                              Successfully Created
                         </div>

                         <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.25;font-weight:800;">
                              ${statusText}
                         </h1>

                         <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9);">
                              Your ${isAlert ? "bill payment alert" : "scheduled reminder"} has been saved successfully.
                         </p>
                    </div>

                    <div style="padding:30px;">
                         <p style="margin:0 0 12px;color:#0f172a;font-size:17px;line-height:1.6;">
                              Hello <strong>${safeName}</strong>,
                         </p>

                         <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
                              We have added your ${isAlert ? "bill alert" : "reminder"} to Spend Analyzer. You will receive an upcoming notification when the scheduled date is near.
                         </p>

                         <div style="background:${softColor};border:1px solid ${isAlert ? "#fecaca" : "#bfdbfe"};border-radius:16px;padding:18px 20px;margin-bottom:22px;">
                              <p style="margin:0;color:${primaryColor};font-size:12px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;">
                                   ${typeText} Details
                              </p>

                              <h2 style="margin:8px 0 0;color:#0f172a;font-size:21px;line-height:1.4;">
                                   ${safeTitle}
                              </h2>
                         </div>

                         <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                              <tr>
                                   <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                        Category
                                   </td>
                                   <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                        ${safeCategory}
                                   </td>
                              </tr>

                              ${
                                   isAlert
                                        ? `
                                        <tr>
                                             <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                                  Bill Amount
                                             </td>
                                             <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#ef4444;font-size:16px;font-weight:800;text-align:right;">
                                                  ${formatCurrency(amount)}
                                             </td>
                                        </tr>
                                   `
                                        : ""
                              }

                              <tr>
                                   <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                        Scheduled Date
                                   </td>
                                   <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                        ${safeDate}
                                   </td>
                              </tr>

                              <tr>
                                   <td style="padding:14px 16px;color:#64748b;font-size:14px;">
                                        Scheduled Time
                                   </td>
                                   <td style="padding:14px 16px;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                        ${safeTime}
                                   </td>
                              </tr>
                         </table>

                         ${
                              note
                                   ? `
                                   <div style="margin-top:22px;background:#fff7ed;border-left:4px solid #f97316;border-radius:10px;padding:15px 16px;">
                                        <p style="margin:0 0 5px;color:#9a3412;font-size:13px;font-weight:800;">
                                             PERSONAL NOTE
                                        </p>
                                        <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.65;">
                                             ${safeNote}
                                        </p>
                                   </div>
                              `
                                   : ""
                         }

                         <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
                              <p style="margin:0;color:#475569;font-size:13px;line-height:1.7;">
                                   ${
                                        isAlert
                                             ? "Keep sufficient funds ready before the due date to avoid missing your payment."
                                             : "Please review your reminder before the scheduled date and complete the required task."
                                   }
                              </p>
                         </div>
                    </div>

                    <div style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                         <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                              This is an automated confirmation email from <strong>Spend Analyzer</strong>.<br />
                              Please do not reply directly to this email.
                         </p>
                    </div>
               </div>
          </div>
     `;
};

const dueMailTemplate = ({
     name,
     title,
     type,
     category,
     amount,
     date,
     time,
     note,
}) => {
     const isAlert = type === "alert";

     const safeName = escapeHtml(name || "User");
     const safeTitle = escapeHtml(title);
     const safeCategory = escapeHtml(category || "Other");
     const safeDate = escapeHtml(date);
     const safeTime = escapeHtml(time || "Not set");
     const safeNote = escapeHtml(note);

     const primaryColor = isAlert ? "#dc2626" : "#2563eb";
     const gradientEnd = isAlert ? "#991b1b" : "#1d4ed8";
     const typeText = isAlert ? "Bill Alert" : "Reminder";

     return `
          <div style="margin:0;padding:32px 15px;background:#eef3f9;font-family:Arial,Helvetica,sans-serif;">
               <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.14);">

                    <div style="background:linear-gradient(135deg,${primaryColor},${gradientEnd});padding:34px 30px;color:#ffffff;">
                         <div style="display:inline-block;background:rgba(255,255,255,0.18);padding:7px 12px;border-radius:30px;font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">
                              Due Soon
                         </div>

                         <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.25;font-weight:800;">
                              ${isAlert ? "Your Bill Is Due Soon" : "Your Reminder Is Due Soon"}
                         </h1>

                         <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9);">
                              ${isAlert
                                   ? "Please review your payment details and take action before the due date."
                                   : "Your scheduled task is approaching. Please review the reminder details below."}
                         </p>
                    </div>

                    <div style="padding:30px;">
                         <p style="margin:0 0 12px;color:#0f172a;font-size:17px;line-height:1.6;">
                              Hello <strong>${safeName}</strong>,
                         </p>

                         <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
                              This is your upcoming ${isAlert ? "bill payment" : "task"} notification from Spend Analyzer.
                         </p>

                         <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;margin-bottom:22px;">
                              <div style="background:#f8fafc;padding:18px 20px;border-bottom:1px solid #e2e8f0;">
                                   <p style="margin:0 0 6px;color:${primaryColor};font-size:12px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;">
                                        ${typeText}
                                   </p>

                                   <h2 style="margin:0;color:#0f172a;font-size:21px;line-height:1.4;">
                                        ${safeTitle}
                                   </h2>
                              </div>

                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                   <tr>
                                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                             Category
                                        </td>
                                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${safeCategory}
                                        </td>
                                   </tr>

                                   ${
                                        isAlert
                                             ? `
                                             <tr>
                                                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                                       Amount Due
                                                  </td>
                                                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#dc2626;font-size:16px;font-weight:800;text-align:right;">
                                                       ${formatCurrency(amount)}
                                                  </td>
                                             </tr>
                                        `
                                             : ""
                                   }

                                   <tr>
                                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">
                                             Due Date
                                        </td>
                                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${safeDate}
                                        </td>
                                   </tr>

                                   <tr>
                                        <td style="padding:14px 18px;color:#64748b;font-size:14px;">
                                             Due Time
                                        </td>
                                        <td style="padding:14px 18px;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">
                                             ${safeTime}
                                        </td>
                                   </tr>
                              </table>
                         </div>

                         ${
                              note
                                   ? `
                                   <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:10px;padding:15px 16px;margin-bottom:22px;">
                                        <p style="margin:0 0 5px;color:#9a3412;font-size:13px;font-weight:800;">
                                             NOTE
                                        </p>
                                        <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.65;">
                                             ${safeNote}
                                        </p>
                                   </div>
                              `
                                   : ""
                         }

                         <div style="padding:18px;background:${isAlert ? "#fef2f2" : "#eff6ff"};border-radius:12px;">
                              <p style="margin:0;color:${isAlert ? "#991b1b" : "#1e40af"};font-size:14px;line-height:1.7;font-weight:600;">
                                   ${
                                        isAlert
                                             ? "Action needed: Make the payment before the due date to avoid missing your bill."
                                             : "Action needed: Review and complete this reminder before the scheduled time."
                                   }
                              </p>
                         </div>
                    </div>

                    <div style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                         <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                              This is an automated due notification from <strong>Spend Analyzer</strong>.<br />
                              Stay organized. Stay on top of your expenses.
                         </p>
                    </div>
               </div>
          </div>
     `;
};

const forgotPasswordOtpTemplate = ({ name, otp }) => {

     const safeName = escapeHtml(name || "User");

     const safeOtp = escapeHtml(otp);



     return `

          <div style="margin:0;padding:32px 15px;background:#eef3f9;font-family:Arial,Helvetica,sans-serif;">

               <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.14);">



                    <div style="padding:34px 28px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;text-align:center;">

                         <div style="width:62px;height:62px;line-height:62px;margin:0 auto 16px;border-radius:18px;background:rgba(255,255,255,0.18);font-size:28px;">

                              🔐

                         </div>



                         <h1 style="margin:0;font-size:27px;line-height:1.3;font-weight:800;">

                              Reset Your Password

                         </h1>



                         <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9);">

                              Use the verification code below to continue securely.

                         </p>

                    </div>



                    <div style="padding:32px 28px;text-align:center;">

                         <p style="margin:0 0 12px;color:#0f172a;font-size:16px;line-height:1.6;">

                              Hello <strong>${safeName}</strong>,

                         </p>



                         <p style="margin:0;color:#64748b;font-size:14px;line-height:1.75;">

                              We received a request to reset your Spend Analyzer password.

                              Enter the following 4-digit verification code in the app.

                         </p>



                         <div style="margin:26px auto;padding:20px 16px;max-width:255px;border:1px dashed #8b5cf6;border-radius:16px;background:#f5f3ff;">

                              <p style="margin:0 0 8px;color:#7c3aed;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">

                                   Password Reset Code

                              </p>



                              <div style="color:#4c1d95;font-size:34px;font-weight:800;letter-spacing:11px;line-height:1;">

                                   ${safeOtp}

                              </div>

                         </div>



                         <div style="margin-top:22px;padding:15px 16px;border-radius:12px;background:#fff7ed;text-align:left;">

                              <p style="margin:0;color:#9a3412;font-size:13px;font-weight:800;">

                                   Important

                              </p>



                              <p style="margin:6px 0 0;color:#7c2d12;font-size:13px;line-height:1.65;">

                                   This verification code expires in 10 minutes. Do not share this code with anyone.

                              </p>

                         </div>



                         <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;line-height:1.7;">

                              If you did not request a password reset, you can safely ignore this email.

                              Your account password will remain unchanged.

                         </p>

                    </div>



                    <div style="padding:18px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;text-align:center;">

                         <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">

                              This is an automated security email from <strong>Spend Analyzer</strong>.<br />

                              Please do not reply directly to this email.

                         </p>

                    </div>

               </div>

          </div>

     `;

};

const passwordChangedMailTemplate = ({ name }) => {
     return `
          <div style="margin:0;padding:32px 15px;background:#eef3f9;font-family:Arial,Helvetica,sans-serif;">
               <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.14);">

                    <div style="padding:34px 28px;background:linear-gradient(135deg,#059669,#047857);color:#ffffff;text-align:center;">
                         <div style="width:62px;height:62px;line-height:62px;margin:0 auto 16px;border-radius:18px;background:rgba(255,255,255,0.18);font-size:28px;">
                              ✓
                         </div>

                         <h1 style="margin:0;font-size:27px;line-height:1.3;font-weight:800;">
                              Password Changed Successfully
                         </h1>

                         <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.9);">
                              Your Spend Analyzer account password has been updated.
                         </p>
                    </div>

                    <div style="padding:32px 28px;text-align:center;">
                         <p style="margin:0 0 12px;color:#0f172a;font-size:16px;line-height:1.6;">
                              Hello <strong>${name || "User"}</strong>,
                         </p>

                         <p style="margin:0;color:#64748b;font-size:14px;line-height:1.75;">
                              Your password was changed successfully. You can now sign in to your Spend Analyzer account using your new password.
                         </p>

                         <div style="margin-top:24px;padding:16px;border-radius:12px;background:#ecfdf5;border-left:4px solid #10b981;text-align:left;">
                              <p style="margin:0;color:#065f46;font-size:13px;font-weight:800;">
                                   Security Notice
                              </p>

                              <p style="margin:7px 0 0;color:#047857;font-size:13px;line-height:1.65;">
                                   If you did not change your password, please secure your account immediately and contact support.
                              </p>
                         </div>

                         <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;line-height:1.7;">
                              This is an automated security notification from Spend Analyzer.
                         </p>
                    </div>

                    <div style="padding:18px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;text-align:center;">
                         <p style="margin:0;color:#94a3b8;font-size:12px;">
                              Spend Analyzer · Account Security
                         </p>
                    </div>
               </div>
          </div>
     `;
};

module.exports = {
     loginOtpMailTemplate,
     forgotPasswordOtpTemplate,
     passwordChangedMailTemplate,
     reminderMailTemplate,
     dueMailTemplate
};