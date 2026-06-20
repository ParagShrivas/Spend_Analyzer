import React, { useEffect, useState } from "react";
import "../css/settings.css";

const API_URL = "http://localhost:1500/settings";

export default function Settings() {
     const [activeTab, setActiveTab] = useState("notifications");
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);

     const [message, setMessage] = useState("");
     const [messageType, setMessageType] = useState("success");

     const [showPasswordBox, setShowPasswordBox] = useState(false);
     const [showDeleteBox, setShowDeleteBox] = useState(false);
     const [showClearBox, setShowClearBox] = useState(false);

     const [passwordLoading, setPasswordLoading] = useState(false);
     const [deleteLoading, setDeleteLoading] = useState(false);
     const [clearLoading, setClearLoading] = useState(false);

     const [notifications, setNotifications] = useState({
          dashboardNotifications: true,
          reminderEmails: true,
          alertEmails: true,
          upcomingReminderEmails: true,
          budgetAlerts: true
     });

     const [privacy, setPrivacy] = useState({
          expenseVisibility: "private",
          activityTracking: true,
          productEmails: false
     });

     const [passwordData, setPasswordData] = useState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
     });

     const [deletePassword, setDeletePassword] = useState("");

     const showMessage = (text, type = "success") => {
          setMessage(text);
          setMessageType(type);

          setTimeout(() => {
               setMessage("");
          }, 3500);
     };

     const safeJson = async (response) => {
          try {
               return await response.json();
          } catch {
               return {};
          }
     };

     const fetchSettings = async () => {
          try {
               setLoading(true);

               const response = await fetch(API_URL, {
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(data.message || "Unable to load settings");
               }

               const settings = data.settings || {};

               setNotifications({
                    dashboardNotifications:
                         settings.dashboard_notifications ?? true,
                    reminderEmails: settings.reminder_emails ?? true,
                    alertEmails: settings.alert_emails ?? true,
                    upcomingReminderEmails:
                         settings.upcoming_reminder_emails ?? true,
                    budgetAlerts: settings.budget_alerts ?? true
               });

               setPrivacy({
                    expenseVisibility:
                         settings.expense_visibility || "private",
                    activityTracking: settings.activity_tracking ?? true,
                    productEmails: settings.product_emails ?? false
               });
          } catch (error) {
               console.error("Settings fetch error:", error);
               showMessage(error.message || "Unable to load settings", "error");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchSettings();
     }, []);

     const handleNotificationChange = (e) => {
          const { name, checked } = e.target;

          setNotifications((prev) => ({
               ...prev,
               [name]: checked
          }));
     };

     const handlePrivacyChange = (e) => {
          const { name, value, checked, type } = e.target;

          setPrivacy((prev) => ({
               ...prev,
               [name]: type === "checkbox" ? checked : value
          }));
     };

     const handlePasswordChange = (e) => {
          const { name, value } = e.target;

          setPasswordData((prev) => ({
               ...prev,
               [name]: value
          }));
     };

     const saveNotifications = async (e) => {
          e.preventDefault();

          try {
               setSaving(true);

               const response = await fetch(`${API_URL}/notifications`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(notifications)
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Unable to save notification settings"
                    );
               }

               showMessage(
                    data.message || "Notification settings saved successfully."
               );
          } catch (error) {
               showMessage(error.message, "error");
          } finally {
               setSaving(false);
          }
     };

     const savePrivacy = async (e) => {
          e.preventDefault();

          try {
               setSaving(true);

               const response = await fetch(`${API_URL}/privacy`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(privacy)
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Unable to save privacy settings"
                    );
               }

               showMessage(
                    data.message || "Privacy settings saved successfully."
               );
          } catch (error) {
               showMessage(error.message, "error");
          } finally {
               setSaving(false);
          }
     };

     const updatePassword = async (e) => {
          e.preventDefault();

          if (
               !passwordData.currentPassword ||
               !passwordData.newPassword ||
               !passwordData.confirmPassword
          ) {
               showMessage("Please fill all password fields.", "error");
               return;
          }

          if (passwordData.newPassword.length < 8) {
               showMessage(
                    "New password must contain at least 8 characters.",
                    "error"
               );
               return;
          }

          if (passwordData.newPassword !== passwordData.confirmPassword) {
               showMessage("New passwords do not match.", "error");
               return;
          }

          try {
               setPasswordLoading(true);

               const response = await fetch(`http://localhost:1500/user/password`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(passwordData)
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(data.message || "Unable to update password");
               }

               setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
               });

               setShowPasswordBox(false);
               showMessage(data.message || "Password updated successfully.");
          } catch (error) {
               showMessage(error.message, "error");
          } finally {
               setPasswordLoading(false);
          }
     };

     const exportData = async () => {
          try {
               const response = await fetch(`${API_URL}/export`, {
                    credentials: "include"
               });

               if (!response.ok) {
                    const data = await safeJson(response);
                    throw new Error(data.message || "Unable to export data");
               }

               const blob = await response.blob();
               const fileUrl = window.URL.createObjectURL(blob);
               const link = document.createElement("a");

               link.href = fileUrl;
               link.download = "spend-analyzer-data.csv";

               document.body.appendChild(link);
               link.click();
               link.remove();

               window.URL.revokeObjectURL(fileUrl);

               showMessage("Your data export has been downloaded.");
          } catch (error) {
               showMessage(error.message, "error");
          }
     };

     const clearNotifications = async () => {
          try {
               setClearLoading(true);

               const response = await fetch(`${API_URL}/notifications`, {
                    method: "DELETE",
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Unable to clear notifications"
                    );
               }

               setShowClearBox(false);
               showMessage(data.message || "Notifications cleared successfully.");
          } catch (error) {
               showMessage(error.message, "error");
          } finally {
               setClearLoading(false);
          }
     };

     const deleteAccount = async () => {
          if (!deletePassword) {
               showMessage("Enter your password to delete the account.", "error");
               return;
          }

          try {
               setDeleteLoading(true);

               const response = await fetch(`${API_URL}/account`, {
                    method: "DELETE",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         password: deletePassword
                    })
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(data.message || "Unable to delete account");
               }

               window.location.href = "/";
          } catch (error) {
               showMessage(error.message, "error");
          } finally {
               setDeleteLoading(false);
          }
     };

     if (loading) {
          return (
               <div className="settings-page settings-loading">
                    <div className="settings-loader"></div>
                    <p>Loading settings...</p>
               </div>
          );
     }

     return (
          <div className="settings-page">
               {message && (
                    <div className={`settings-toast ${messageType}`}>
                         <i
                              className={
                                   messageType === "error"
                                        ? "fa-solid fa-circle-xmark"
                                        : "fa-solid fa-circle-check"
                              }
                         ></i>
                         <span>{message}</span>
                    </div>
               )}

               <div className="settings-header">
                    <div>
                         <span className="settings-eyebrow">
                              APPLICATION CONTROLS
                         </span>

                         <h2>Settings</h2>

                         <p>
                              Manage notifications, privacy, security, and account
                              controls.
                         </p>
                    </div>

                    <div className="settings-header-icon">
                         <i className="fa-solid fa-gear"></i>
                    </div>
               </div>

               <div className="settings-layout">
                    <aside className="settings-sidebar">
                         <button
                              type="button"
                              className={
                                   activeTab === "notifications" ? "active" : ""
                              }
                              onClick={() => setActiveTab("notifications")}
                         >
                              <i className="fa-regular fa-bell"></i>
                              <span>Notifications</span>
                         </button>

                         <button
                              type="button"
                              className={activeTab === "privacy" ? "active" : ""}
                              onClick={() => setActiveTab("privacy")}
                         >
                              <i className="fa-solid fa-user-shield"></i>
                              <span>Data & Privacy</span>
                         </button>

                         <button
                              type="button"
                              className={activeTab === "security" ? "active" : ""}
                              onClick={() => setActiveTab("security")}
                         >
                              <i className="fa-solid fa-shield-halved"></i>
                              <span>Security</span>
                         </button>

                         <button
                              type="button"
                              className={`danger-tab ${activeTab === "danger" ? "active" : ""
                                   }`}
                              onClick={() => setActiveTab("danger")}
                         >
                              <i className="fa-solid fa-triangle-exclamation"></i>
                              <span>Danger Zone</span>
                         </button>
                    </aside>

                    <main className="settings-content">
                         {activeTab === "notifications" && (
                              <form
                                   className="settings-card"
                                   onSubmit={saveNotifications}
                              >
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon notification-icon">
                                             <i className="fa-regular fa-bell"></i>
                                        </div>

                                        <div>
                                             <h3>Notification Settings</h3>
                                             <p>
                                                  Choose how you want to receive reminders,
                                                  alerts, and budget updates.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="settings-option-list">
                                        <ToggleOption
                                             icon="fa-solid fa-bell"
                                             title="Dashboard Notifications"
                                             description="Show reminders and bill alerts inside your dashboard."
                                             name="dashboardNotifications"
                                             checked={
                                                  notifications.dashboardNotifications
                                             }
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-envelope"
                                             title="Reminder Confirmation Emails"
                                             description="Receive an email when a new reminder is created."
                                             name="reminderEmails"
                                             checked={notifications.reminderEmails}
                                             disabled={true}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-file-invoice-dollar"
                                             title="Bill Alert Confirmation Emails"
                                             description="Receive an email when a new bill alert is created."
                                             name="alertEmails"
                                             checked={notifications.alertEmails}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-clock"
                                             title="Upcoming Due Emails"
                                             description="Receive emails when a bill alert or reminder is near its due time."
                                             name="upcomingReminderEmails"
                                             checked={
                                                  notifications.upcomingReminderEmails
                                             }
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-chart-line"
                                             title="Budget Alerts"
                                             description="Get notified when spending reaches your budget limit."
                                             name="budgetAlerts"
                                             checked={notifications.budgetAlerts}
                                             onChange={handleNotificationChange}
                                        />
                                   </div>

                                   <div className="settings-action">
                                        <button
                                             type="submit"
                                             className="save-setting-btn"
                                             disabled={saving}
                                        >
                                             {saving ? (
                                                  <>
                                                       <span className="settings-btn-spinner"></span>
                                                       Saving...
                                                  </>
                                             ) : (
                                                  <>
                                                       <i className="fa-solid fa-floppy-disk"></i>
                                                       Save Notification Settings
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </form>
                         )}

                         {activeTab === "privacy" && (
                              <form className="settings-card" onSubmit={savePrivacy}>
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon privacy-icon">
                                             <i className="fa-solid fa-user-shield"></i>
                                        </div>

                                        <div>
                                             <h3>Data & Privacy</h3>
                                             <p>
                                                  Control how your financial data and account
                                                  activity are handled.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="privacy-info-box">
                                        <i className="fa-solid fa-lock"></i>

                                        <div>
                                             <h4>Your financial information stays private</h4>
                                             <p>
                                                  Expenses, budgets, reminders, and alerts are
                                                  securely linked to your account.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="settings-form-grid">
                                        <div className="form-group">
                                             <label>Expense Data Visibility</label>

                                             <select
                                                  name="expenseVisibility"
                                                  value={privacy.expenseVisibility}
                                                  onChange={handlePrivacyChange}
                                             >
                                                  <option value="private">
                                                       Private — Only Me
                                                  </option>

                                                  <option value="shared">
                                                       Shared — Future Feature
                                                  </option>
                                             </select>
                                        </div>
                                   </div>

                                   <div className="settings-option-list">
                                        <ToggleOption
                                             icon="fa-solid fa-clock-rotate-left"
                                             title="Activity Tracking"
                                             description="Keep history of changes made to expenses, budgets, reminders, and alerts."
                                             name="activityTracking"
                                             checked={privacy.activityTracking}
                                             onChange={handlePrivacyChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-envelope-open-text"
                                             title="Product Updates"
                                             description="Receive optional emails about future Spend Analyzer features."
                                             name="productEmails"
                                             checked={privacy.productEmails}
                                             onChange={handlePrivacyChange}
                                        />
                                   </div>

                                   <div className="privacy-download-box">
                                        <div>
                                             <h4>Download Your Data</h4>
                                             <p>
                                                  Export expenses, reminders, alerts, and
                                                  settings for your personal records.
                                             </p>
                                        </div>

                                        <button
                                             type="button"
                                             className="download-data-btn"
                                             onClick={exportData}
                                        >
                                             <i className="fa-solid fa-download"></i>
                                             Export Data
                                        </button>
                                   </div>

                                   <div className="settings-action">
                                        <button
                                             type="submit"
                                             className="save-setting-btn"
                                             disabled={saving}
                                        >
                                             {saving ? (
                                                  <>
                                                       <span className="settings-btn-spinner"></span>
                                                       Saving...
                                                  </>
                                             ) : (
                                                  <>
                                                       <i className="fa-solid fa-floppy-disk"></i>
                                                       Save Privacy Settings
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </form>
                         )}

                         {activeTab === "security" && (
                              <div className="settings-card">
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon security-icon">
                                             <i className="fa-solid fa-shield-halved"></i>
                                        </div>

                                        <div>
                                             <h3>Security & Account</h3>
                                             <p>
                                                  Review your account security and password
                                                  protection.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="security-status-box">
                                        <div className="security-status-icon">
                                             <i className="fa-solid fa-circle-check"></i>
                                        </div>

                                        <div>
                                             <h4>Your account is protected</h4>
                                             <p>
                                                  Your account is active and secured with password
                                                  authentication.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="security-action-list">
                                        <div className="security-action-item">
                                             <div>
                                                  <h5>Change Password</h5>
                                                  <p>
                                                       Update your password regularly to keep your
                                                       account protected.
                                                  </p>
                                             </div>

                                             <button
                                                  type="button"
                                                  onClick={() => setShowPasswordBox(true)}
                                             >
                                                  Change Password
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         )}

                         {activeTab === "danger" && (
                              <div className="settings-card danger-card">
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon danger-icon">
                                             <i className="fa-solid fa-triangle-exclamation"></i>
                                        </div>

                                        <div>
                                             <h3>Danger Zone</h3>
                                             <p>
                                                  These actions can permanently remove data from
                                                  your account.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="danger-action">
                                        <div>
                                             <h4>Clear All Notifications</h4>
                                             <p>
                                                  Permanently remove all reminders and bill alerts
                                                  from your account.
                                             </p>
                                        </div>

                                        <button
                                             type="button"
                                             className="outline-danger-btn"
                                             onClick={() => setShowClearBox(true)}
                                        >
                                             Clear Notifications
                                        </button>
                                   </div>

                                   <div className="danger-action">
                                        <div>
                                             <h4>Delete Account</h4>
                                             <p>
                                                  Permanently delete your profile, expenses,
                                                  budgets, reminders, and alerts.
                                             </p>
                                        </div>

                                        <button
                                             type="button"
                                             className="danger-delete-btn"
                                             onClick={() => setShowDeleteBox(true)}
                                        >
                                             Delete Account
                                        </button>
                                   </div>
                              </div>
                         )}
                    </main>
               </div>

               {showPasswordBox && (
                    <div className="delete-account-overlay">
                         <form
                              className="delete-account-box password-modal"
                              onSubmit={updatePassword}
                         >
                              <div className="delete-account-icon security-modal-icon">
                                   <i className="fa-solid fa-key"></i>
                              </div>

                              <h3>Change Password</h3>
                              <p>Choose a strong new password for your account.</p>

                              <div className="password-form-fields">
                                   <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Current password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                   />

                                   <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                   />

                                   <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                   />
                              </div>

                              <div className="delete-account-actions">
                                   <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={() => setShowPasswordBox(false)}
                                   >
                                        Cancel
                                   </button>

                                   <button
                                        type="submit"
                                        className="confirm-delete-btn security-confirm-btn"
                                        disabled={passwordLoading}
                                   >
                                        {passwordLoading
                                             ? "Updating..."
                                             : "Update Password"}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}

               {showClearBox && (
                    <div className="delete-account-overlay">
                         <div className="delete-account-box">
                              <div className="delete-account-icon">
                                   <i className="fa-solid fa-bell-slash"></i>
                              </div>

                              <h3>Clear all notifications?</h3>

                              <p>
                                   All reminders and bill alerts will be permanently removed.
                                   This action cannot be undone.
                              </p>

                              <div className="delete-account-actions">
                                   <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={() => setShowClearBox(false)}
                                   >
                                        Cancel
                                   </button>

                                   <button
                                        type="button"
                                        className="confirm-delete-btn"
                                        disabled={clearLoading}
                                        onClick={clearNotifications}
                                   >
                                        {clearLoading
                                             ? "Clearing..."
                                             : "Yes, Clear All"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {showDeleteBox && (
                    <div className="delete-account-overlay">
                         <div className="delete-account-box">
                              <div className="delete-account-icon">
                                   <i className="fa-solid fa-triangle-exclamation"></i>
                              </div>

                              <h3>Delete your account?</h3>

                              <p>
                                   This permanently removes your profile, expenses,
                                   budgets, reminders, and alerts. Enter your password
                                   to continue.
                              </p>

                              <input
                                   className="delete-password-input"
                                   type="password"
                                   placeholder="Enter your password"
                                   value={deletePassword}
                                   onChange={(e) =>
                                        setDeletePassword(e.target.value)
                                   }
                              />

                              <div className="delete-account-actions">
                                   <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={() => {
                                             setShowDeleteBox(false);
                                             setDeletePassword("");
                                        }}
                                   >
                                        Cancel
                                   </button>

                                   <button
                                        type="button"
                                        className="confirm-delete-btn"
                                        disabled={deleteLoading}
                                        onClick={deleteAccount}
                                   >
                                        {deleteLoading
                                             ? "Deleting..."
                                             : "Yes, Delete Account"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
               
          </div>
     );
}

function ToggleOption({ icon, title, description, name, checked, onChange }) {
     return (
          <div className="settings-toggle-item">
               <div className="settings-toggle-icon">
                    <i className={icon}></i>
               </div>

               <div className="settings-toggle-text">
                    <h5>{title}</h5>
                    <p>{description}</p>
               </div>

               <label className="switch">
                    <input
                         type="checkbox"
                         name={name}
                         checked={checked}
                         onChange={onChange}
                    />

                    <span className="slider"></span>
               </label>
          </div>
     );
}

