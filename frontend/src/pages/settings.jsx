import React, { useState } from "react";
import "../css/settings.css";
import "../css/dashboard.css";

export default function Settings() {
     const [activeTab, setActiveTab] = useState("notifications");

     const [notifications, setNotifications] = useState({
          dashboardNotifications: true,
          reminderEmails: true,
          alertEmails: true,
          upcomingReminderEmails: true,
          budgetAlerts: true
     });

     const [preferences, setPreferences] = useState({
          currency: "INR",
          language: "English",
          dateFormat: "DD/MM/YYYY",
          startDay: "Monday"
     });

     const [appearance, setAppearance] = useState({
          theme: "light",
          compactMode: false
     });

     const [showDeleteBox, setShowDeleteBox] = useState(false);
     const [message, setMessage] = useState("");

     const showMessage = (text) => {
          setMessage(text);

          setTimeout(() => {
               setMessage("");
          }, 3000);
     };

     const handleNotificationChange = (e) => {
          const { name, checked } = e.target;

          setNotifications((prev) => ({
               ...prev,
               [name]: checked
          }));
     };

     const handlePreferenceChange = (e) => {
          const { name, value } = e.target;

          setPreferences((prev) => ({
               ...prev,
               [name]: value
          }));
     };

     const handleAppearanceChange = (e) => {
          const { name, value, checked, type } = e.target;

          setAppearance((prev) => ({
               ...prev,
               [name]: type === "checkbox" ? checked : value
          }));
     };

     const saveNotifications = (e) => {
          e.preventDefault();
          console.log("Notification settings:", notifications);
          showMessage("Notification settings saved successfully.");
     };

     const savePreferences = (e) => {
          e.preventDefault();
          console.log("App preferences:", preferences);
          showMessage("App preferences saved successfully.");
     };

     const saveAppearance = (e) => {
          e.preventDefault();
          console.log("Appearance settings:", appearance);
          showMessage("Appearance settings saved successfully.");
     };

     return (
          <div className="settings-page">
               {message && (
                    <div className="settings-toast">
                         <i className="fa-solid fa-circle-check"></i>
                         {message}
                    </div>
               )}

               <div className="settings-header">
                    <div>
                         <span className="settings-eyebrow">APPLICATION CONTROLS</span>
                         <h2>Settings</h2>
                         <p>
                              Customize notifications, appearance, preferences, and
                              account controls.
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
                              className={activeTab === "notifications" ? "active" : ""}
                              onClick={() => setActiveTab("notifications")}
                         >
                              <i className="fa-regular fa-bell"></i>
                              <span>Notifications</span>
                         </button>

                         <button
                              type="button"
                              className={activeTab === "preferences" ? "active" : ""}
                              onClick={() => setActiveTab("preferences")}
                         >
                              <i className="fa-solid fa-sliders"></i>
                              <span>Preferences</span>
                         </button>

                         <button
                              type="button"
                              className={activeTab === "appearance" ? "active" : ""}
                              onClick={() => setActiveTab("appearance")}
                         >
                              <i className="fa-regular fa-moon"></i>
                              <span>Appearance</span>
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
                              className={`danger-tab ${activeTab === "danger" ? "active" : ""}`}
                              onClick={() => setActiveTab("danger")}
                         >
                              <i className="fa-solid fa-triangle-exclamation"></i>
                              <span>Danger Zone</span>
                         </button>
                    </aside>

                    <main className="settings-content">
                         {activeTab === "notifications" && (
                              <form className="settings-card" onSubmit={saveNotifications}>
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon notification-icon">
                                             <i className="fa-regular fa-bell"></i>
                                        </div>

                                        <div>
                                             <h3>Notification Settings</h3>
                                             <p>
                                                  Choose how you want to receive updates
                                                  from your expense tracker.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="settings-option-list">
                                        <ToggleOption
                                             icon="fa-solid fa-bell"
                                             title="Dashboard Notifications"
                                             description="Show reminders and alerts inside the dashboard."
                                             name="dashboardNotifications"
                                             checked={notifications.dashboardNotifications}
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-envelope"
                                             title="Reminder Emails"
                                             description="Receive confirmation emails when creating reminders."
                                             name="reminderEmails"
                                             checked={notifications.reminderEmails}
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-file-invoice-dollar"
                                             title="Bill Alert Emails"
                                             description="Receive confirmation emails when creating bill alerts."
                                             name="alertEmails"
                                             checked={notifications.alertEmails}
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-clock"
                                             title="Upcoming Due Emails"
                                             description="Receive emails when your reminder or bill due date is near."
                                             name="upcomingReminderEmails"
                                             checked={notifications.upcomingReminderEmails}
                                             onChange={handleNotificationChange}
                                        />

                                        <ToggleOption
                                             icon="fa-solid fa-chart-line"
                                             title="Budget Alerts"
                                             description="Get notified when your expenses reach your budget limit."
                                             name="budgetAlerts"
                                             checked={notifications.budgetAlerts}
                                             onChange={handleNotificationChange}
                                        />
                                   </div>

                                   <div className="settings-action">
                                        <button className="save-setting-btn" type="submit">
                                             <i className="fa-solid fa-floppy-disk"></i>
                                             Save Notification Settings
                                        </button>
                                   </div>
                              </form>
                         )}

                         {activeTab === "preferences" && (
                              <form className="settings-card" onSubmit={savePreferences}>
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon preferences-icon">
                                             <i className="fa-solid fa-sliders"></i>
                                        </div>

                                        <div>
                                             <h3>App Preferences</h3>
                                             <p>
                                                  Configure how dates, currencies, and app
                                                  content are displayed.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="settings-form-grid">
                                        <div className="form-group">
                                             <label>Default Currency</label>
                                             <select
                                                  name="currency"
                                                  value={preferences.currency}
                                                  onChange={handlePreferenceChange}
                                             >
                                                  <option value="INR">INR (₹)</option>
                                                  <option value="USD">USD ($)</option>
                                                  <option value="EUR">EUR (€)</option>
                                                  <option value="GBP">GBP (£)</option>
                                             </select>
                                        </div>

                                        <div className="form-group">
                                             <label>Language</label>
                                             <select
                                                  name="language"
                                                  value={preferences.language}
                                                  onChange={handlePreferenceChange}
                                             >
                                                  <option value="English">English</option>
                                                  <option value="Hindi">Hindi</option>
                                             </select>
                                        </div>

                                        <div className="form-group">
                                             <label>Date Format</label>
                                             <select
                                                  name="dateFormat"
                                                  value={preferences.dateFormat}
                                                  onChange={handlePreferenceChange}
                                             >
                                                  <option value="DD/MM/YYYY">
                                                       DD/MM/YYYY
                                                  </option>
                                                  <option value="MM/DD/YYYY">
                                                       MM/DD/YYYY
                                                  </option>
                                                  <option value="YYYY-MM-DD">
                                                       YYYY-MM-DD
                                                  </option>
                                             </select>
                                        </div>

                                        <div className="form-group">
                                             <label>Week Starts On</label>
                                             <select
                                                  name="startDay"
                                                  value={preferences.startDay}
                                                  onChange={handlePreferenceChange}
                                             >
                                                  <option value="Monday">Monday</option>
                                                  <option value="Sunday">Sunday</option>
                                                  <option value="Saturday">Saturday</option>
                                             </select>
                                        </div>
                                   </div>

                                   <div className="settings-action">
                                        <button className="save-setting-btn" type="submit">
                                             <i className="fa-solid fa-floppy-disk"></i>
                                             Save Preferences
                                        </button>
                                   </div>
                              </form>
                         )}

                         {activeTab === "appearance" && (
                              <form className="settings-card" onSubmit={saveAppearance}>
                                   <div className="settings-card-header">
                                        <div className="settings-card-icon appearance-icon">
                                             <i className="fa-regular fa-moon"></i>
                                        </div>

                                        <div>
                                             <h3>Appearance Settings</h3>
                                             <p>
                                                  Change the visual style and layout of your
                                                  dashboard.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="theme-options">
                                        <label
                                             className={`theme-option ${
                                                  appearance.theme === "light"
                                                       ? "selected"
                                                       : ""
                                             }`}
                                        >
                                             <input
                                                  type="radio"
                                                  name="theme"
                                                  value="light"
                                                  checked={appearance.theme === "light"}
                                                  onChange={handleAppearanceChange}
                                             />

                                             <div className="theme-preview light-preview">
                                                  <span></span>
                                                  <span></span>
                                                  <span></span>
                                             </div>

                                             <div>
                                                  <h5>Light Mode</h5>
                                                  <p>Clean and bright dashboard appearance.</p>
                                             </div>
                                        </label>

                                        <label
                                             className={`theme-option ${
                                                  appearance.theme === "dark"
                                                       ? "selected"
                                                       : ""
                                             }`}
                                        >
                                             <input
                                                  type="radio"
                                                  name="theme"
                                                  value="dark"
                                                  checked={appearance.theme === "dark"}
                                                  onChange={handleAppearanceChange}
                                             />

                                             <div className="theme-preview dark-preview">
                                                  <span></span>
                                                  <span></span>
                                                  <span></span>
                                             </div>

                                             <div>
                                                  <h5>Dark Mode</h5>
                                                  <p>Comfortable viewing in low-light spaces.</p>
                                             </div>
                                        </label>
                                   </div>

                                   <div className="settings-option-list appearance-list">
                                        <ToggleOption
                                             icon="fa-solid fa-table-cells-large"
                                             title="Compact Layout"
                                             description="Reduce spacing and show more information on screen."
                                             name="compactMode"
                                             checked={appearance.compactMode}
                                             onChange={handleAppearanceChange}
                                        />
                                   </div>

                                   <div className="settings-action">
                                        <button className="save-setting-btn" type="submit">
                                             <i className="fa-solid fa-floppy-disk"></i>
                                             Save Appearance
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
                                                  Review your account protection and security
                                                  actions.
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
                                                  Your account is currently active and secured
                                                  with password authentication.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="security-action-list">
                                        <div className="security-action-item">
                                             <div>
                                                  <h5>Change Password</h5>
                                                  <p>
                                                       Update your password regularly to keep
                                                       your account protected.
                                                  </p>
                                             </div>

                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       showMessage(
                                                            "Open your Account Settings page to update password."
                                                       )
                                                  }
                                             >
                                                  Change Password
                                             </button>
                                        </div>

                                        <div className="security-action-item">
                                             <div>
                                                  <h5>Sign Out From All Devices</h5>
                                                  <p>
                                                       End all active sessions except your
                                                       current session.
                                                  </p>
                                             </div>

                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       showMessage(
                                                            "Sign out from all devices action started."
                                                       )
                                                  }
                                             >
                                                  Sign Out All
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
                                                  These actions can permanently remove your
                                                  account data.
                                             </p>
                                        </div>
                                   </div>

                                   <div className="danger-action">
                                        <div>
                                             <h4>Clear All Notifications</h4>
                                             <p>
                                                  Remove all reminders and bill alerts from
                                                  your account.
                                             </p>
                                        </div>

                                        <button
                                             type="button"
                                             className="outline-danger-btn"
                                             onClick={() =>
                                                  showMessage(
                                                       "Clear notification confirmation will open here."
                                                  )
                                             }
                                        >
                                             Clear Notifications
                                        </button>
                                   </div>

                                   <div className="danger-action">
                                        <div>
                                             <h4>Delete Account</h4>
                                             <p>
                                                  Permanently delete your account, expenses,
                                                  budgets, and notification data.
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

               {showDeleteBox && (
                    <div className="delete-account-overlay">
                         <div className="delete-account-box">
                              <div className="delete-account-icon">
                                   <i className="fa-solid fa-triangle-exclamation"></i>
                              </div>

                              <h3>Delete your account?</h3>

                              <p>
                                   This will permanently remove your profile, expenses,
                                   budgets, reminders, and alerts. This action cannot be
                                   undone.
                              </p>

                              <div className="delete-account-actions">
                                   <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={() => setShowDeleteBox(false)}
                                   >
                                        Cancel
                                   </button>

                                   <button
                                        type="button"
                                        className="confirm-delete-btn"
                                        onClick={() => {
                                             setShowDeleteBox(false);
                                             showMessage(
                                                  "Delete account request started."
                                             );
                                        }}
                                   >
                                        Yes, Delete Account
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