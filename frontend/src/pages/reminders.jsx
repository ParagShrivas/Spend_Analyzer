import React, { useEffect, useState } from "react";
import "../css/reminders.css";
import "../css/expense.css";
import Toast from "../components/toast";

export default function Reminders() {
     const [activeTab, setActiveTab] = useState("reminder");

     const [title, setTitle] = useState("");
     const [category, setCategory] = useState("");
     const [amount, setAmount] = useState("");
     const [date, setDate] = useState("");
     const [time, setTime] = useState("");
     const [note, setNote] = useState("");

     const [items, setItems] = useState([]);
     const [upcomingItems, setUpcomingItems] = useState([]);

     const [pageLoading, setPageLoading] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [refreshing, setRefreshing] = useState(false);
     const [actionLoadingId, setActionLoadingId] = useState(null);

     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [deleteItemId, setDeleteItemId] = useState(null);
     const [deleteItemTitle, setDeleteItemTitle] = useState("");

     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");

     const categories = [
          "Personal",
          "Food & Dining",
          "Travel",
          "Shopping",
          "Bills & Utilities",
          "Entertainment",
          "Healthcare",
          "Education",
          "Groceries",
          "Investment",
          "Other"
     ];

     const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
     }).format(new Date());

     const showMessage = (message, type) => {
          setShowToast(true);
          setToastMessage(message);
          setToastMessageType(type);
     };

     const safeJson = async (response) => {
          try {
               return await response.json();
          } catch {
               return {};
          }
     };

     const clearForm = () => {
          setTitle("");
          setCategory("");
          setAmount("");
          setDate("");
          setTime("");
          setNote("");
     };

     const getStatus = (type, itemDate) => {
          const selected = new Date(itemDate);
          const current = new Date(today);

          const diffTime = selected - current;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays < 0) return "expired";
          if (type === "alert" && diffDays <= 3) return "urgent";

          return "upcoming";
     };

     const getDateLabel = (itemDate) => {
          const selected = new Date(itemDate);
          const current = new Date(today);

          const diffTime = selected - current;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays < 0) return "Expired";
          if (diffDays === 0) return "Today";
          if (diffDays === 1) return "Tomorrow";

          return `${diffDays} days left`;
     };

     const getId = (item) => {
          return item.notification_id || item.id;
     };

     const getItemDate = (item) => {
          return item.notify_date || item.date;
     };

     const getItemTime = (item) => {
          return item.notify_time || item.time;
     };

     const getItemAmount = (item) => {
          return item.amount || "";
     };

     const fetchNotifications = async (showLoader = true) => {
          if (showLoader) setPageLoading(true);

          try {
               const response = await fetch("http://localhost:1500/notification/get", {
                    method: "GET",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (response.ok) {
                    setItems(Array.isArray(data) ? data : data.notifications || []);
               } else {
                    showMessage(data.message || "Error fetching notifications!", "error");
               }
          } catch (error) {
               console.error("Error fetching notifications:", error);
               showMessage("Backend server not reachable!", "error");
          } finally {
               if (showLoader) setPageLoading(false);
          }
     };

     const fetchUpcomingNotifications = async () => {
          try {
               const response = await fetch("http://localhost:1500/notification/upcoming", {
                    method: "GET",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (response.ok) {
                    setUpcomingItems(Array.isArray(data) ? data : data.notifications || []);
               }
          } catch (error) {
               console.error("Error fetching upcoming notifications:", error);
          }
     };

     useEffect(() => {
          const loadData = async () => {
               setPageLoading(true);

               await Promise.all([
                    fetchNotifications(false),
                    fetchUpcomingNotifications()
               ]);

               setPageLoading(false);
          };

          loadData();
     }, []);

     const handleRefresh = async () => {
          if (refreshing) return;

          setRefreshing(true);

          await Promise.all([
               fetchNotifications(false),
               fetchUpcomingNotifications()
          ]);

          setRefreshing(false);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (submitting) return;

          if (!title.trim() || !date) {
               showMessage("Please enter title and date!", "error");
               return;
          }

          if (activeTab === "alert" && amount && Number(amount) < 0) {
               showMessage("Amount cannot be negative!", "error");
               return;
          }

          setSubmitting(true);

          try {
               const response = await fetch("http://localhost:1500/notification/add", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         type: activeTab,
                         title: title.trim(),
                         category: category || "Other",
                         amount: activeTab === "alert" ? Number(amount || 0) : null,
                         notifyDate: date,
                         notifyTime: time || null,
                         note: note.trim()
                    })
               });

               const data = await safeJson(response);

               if (response.ok) {
                    clearForm();

                    showMessage(
                         data.message ||
                              (activeTab === "alert"
                                   ? "Alert created successfully!"
                                   : "Reminder created successfully!"),
                         "success"
                    );

                    await Promise.all([
                         fetchNotifications(false),
                         fetchUpcomingNotifications()
                    ]);
               } else {
                    showMessage(data.message || "Error creating notification!", "error");
               }
          } catch (error) {
               console.error("Error creating notification:", error);
               showMessage("Backend server not reachable!", "error");
          } finally {
               setSubmitting(false);
          }
     };

     const handleRead = async (id) => {
          if (!id || actionLoadingId) return;

          setActionLoadingId(id);

          try {
               const response = await fetch(`http://localhost:1500/notification/read/${id}`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (response.ok) {
                    await Promise.all([
                         fetchNotifications(false),
                         fetchUpcomingNotifications()
                    ]);
               } else {
                    showMessage(data.message || "Error marking notification as read!", "error");
               }
          } catch (error) {
               console.error("Error marking notification as read:", error);
               showMessage("Error marking notification as read!", "error");
          } finally {
               setActionLoadingId(null);
          }
     };

     const openDeleteModal = (id, title) => {
          setDeleteItemId(id);
          setDeleteItemTitle(title);
          setShowDeleteModal(true);
     };

     const closeDeleteModal = () => {
          if (actionLoadingId) return;

          setShowDeleteModal(false);
          setDeleteItemId(null);
          setDeleteItemTitle("");
     };

     const handleDelete = async () => {
          if (!deleteItemId || actionLoadingId) return;

          setActionLoadingId(deleteItemId);

          try {
               const response = await fetch(`http://localhost:1500/notification/delete/${deleteItemId}`, {
                    method: "DELETE",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await safeJson(response);

               if (response.ok) {
                    showMessage(data.message || "Notification deleted successfully!", "success");

                    setShowDeleteModal(false);
                    setDeleteItemId(null);
                    setDeleteItemTitle("");

                    await Promise.all([
                         fetchNotifications(false),
                         fetchUpcomingNotifications()
                    ]);
               } else {
                    showMessage(data.message || "Error deleting notification!", "error");
               }
          } catch (error) {
               console.error("Error deleting notification:", error);
               showMessage("Error deleting notification!", "error");
          } finally {
               setActionLoadingId(null);
          }
     };

     const reminderItems = items.filter((item) => item.type === "reminder");
     const alertItems = items.filter((item) => item.type === "alert");

     const urgentAlerts = alertItems.filter((item) => {
          const itemDate = getItemDate(item);
          return getStatus("alert", itemDate) === "urgent";
     });

     const allItems = [...items].sort((a, b) => {
          const dateA = new Date(`${getItemDate(a)} ${getItemTime(a) || "00:00"}`);
          const dateB = new Date(`${getItemDate(b)} ${getItemTime(b) || "00:00"}`);

          return dateA - dateB;
     });

     return (
          <div className="notifications-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               <div className="notifications-header">
                    <div>
                         <h1>Reminders & Alerts</h1>
                         <p>Create reminders and bill alerts to stay updated before due dates.</p>
                    </div>

                    <button onClick={handleRefresh} disabled={refreshing}>
                         <i className={`fa-solid fa-rotate ${refreshing ? "spin-icon" : ""}`}></i>
                         {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
               </div>

               <div className="notification-stats-grid">
                    <div className="notification-stat-card">
                         <div className="notification-stat-icon blue">
                              <i className="fa-solid fa-clock"></i>
                         </div>

                         <div>
                              <h5>Total Reminders</h5>
                              <h3>{reminderItems.length}</h3>
                         </div>
                    </div>

                    <div className="notification-stat-card">
                         <div className="notification-stat-icon orange">
                              <i className="fa-solid fa-triangle-exclamation"></i>
                         </div>

                         <div>
                              <h5>Bill Alerts</h5>
                              <h3>{alertItems.length}</h3>
                         </div>
                    </div>

                    <div className="notification-stat-card">
                         <div className="notification-stat-icon redbg">
                              <i className="fa-solid fa-bolt"></i>
                         </div>

                         <div>
                              <h5>Urgent Alerts</h5>
                              <h3>{urgentAlerts.length}</h3>
                         </div>
                    </div>

                    <div className="notification-stat-card">
                         <div className="notification-stat-icon greenbg">
                              <i className="fa-solid fa-bell"></i>
                         </div>

                         <div>
                              <h5>Upcoming</h5>
                              <h3>{upcomingItems.length}</h3>
                         </div>
                    </div>
               </div>

               <div className="notifications-main-grid">
                    <div className="notification-form-card">
                         <div className="notification-tabs">
                              <button
                                   type="button"
                                   className={activeTab === "reminder" ? "active" : ""}
                                   onClick={() => setActiveTab("reminder")}
                                   disabled={submitting}
                              >
                                   <i className="fa-solid fa-clock"></i>
                                   Reminder
                              </button>

                              <button
                                   type="button"
                                   className={activeTab === "alert" ? "active" : ""}
                                   onClick={() => setActiveTab("alert")}
                                   disabled={submitting}
                              >
                                   <i className="fa-solid fa-bell"></i>
                                   Bill Alert
                              </button>
                         </div>

                         <div className="notification-form-title">
                              <h3>{activeTab === "alert" ? "Create Bill Alert" : "Create Reminder"}</h3>
                              <p>
                                   {activeTab === "alert"
                                        ? "Add bill due date and get notified before payment date."
                                        : "Add personal reminders for important expense tasks."}
                              </p>
                         </div>

                         <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                   <label>Title</label>
                                   <input
                                        type="text"
                                        placeholder={activeTab === "alert" ? "Electricity bill due" : "Review expenses"}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={submitting}
                                   />
                              </div>

                              <div className="form-row">
                                   <div className="form-group">
                                        <label>Category</label>
                                        <select
                                             value={category}
                                             onChange={(e) => setCategory(e.target.value)}
                                             disabled={submitting}
                                        >
                                             <option value="">Select Category</option>

                                             {categories.map((cat) => (
                                                  <option key={cat} value={cat}>
                                                       {cat}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   {activeTab === "alert" && (
                                        <div className="form-group">
                                             <label>Amount</label>
                                             <input
                                                  type="number"
                                                  placeholder="Bill amount"
                                                  value={amount}
                                                  onChange={(e) => setAmount(e.target.value)}
                                                  disabled={submitting}
                                             />
                                        </div>
                                   )}
                              </div>

                              <div className="form-row">
                                   <div className="form-group">
                                        <label>Date</label>
                                        <input
                                             type="date"
                                             min={today}
                                             value={date}
                                             onChange={(e) => setDate(e.target.value)}
                                             disabled={submitting}
                                        />
                                   </div>

                                   <div className="form-group">
                                        <label>Time</label>
                                        <input
                                             type="time"
                                             value={time}
                                             onChange={(e) => setTime(e.target.value)}
                                             disabled={submitting}
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label>Note</label>
                                   <textarea
                                        placeholder="Write a short note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        disabled={submitting}
                                   ></textarea>
                              </div>

                              <button
                                   type="submit"
                                   className="save-notification-btn"
                                   disabled={submitting}
                              >
                                   {submitting ? (
                                        <>
                                             <span className="btn-spinner"></span>
                                             Saving...
                                        </>
                                   ) : (
                                        <>
                                             {activeTab === "alert" ? "Save Alert" : "Save Reminder"}
                                             <i className="fa-solid fa-check"></i>
                                        </>
                                   )}
                              </button>
                         </form>
                    </div>

                    <div className="notification-preview-card">
                         <div className="notification-card-title">
                              <div>
                                   <h3>Upcoming Notifications</h3>
                                   <p>Upcoming reminders and bill alerts</p>
                              </div>

                              <span>{upcomingItems.length}</span>
                         </div>

                         <div className="dashboard-notification-box">
                              {pageLoading ? (
                                   <div className="notification-loader-box">
                                        <span className="notification-loader"></span>
                                        <p>Loading notifications...</p>
                                   </div>
                              ) : upcomingItems.length > 0 ? (
                                   upcomingItems.slice(0, 4).map((item) => {
                                        const itemDate = getItemDate(item);
                                        const itemTime = getItemTime(item);
                                        const status = getStatus(item.type, itemDate);
                                        const id = getId(item);

                                        return (
                                             <div
                                                  className={`dashboard-notification-item ${status}`}
                                                  key={id}
                                                  onClick={() => handleRead(id)}
                                             >
                                                  <div className="dashboard-notification-icon">
                                                       {actionLoadingId === id ? (
                                                            <span className="mini-spinner"></span>
                                                       ) : (
                                                            <i
                                                                 className={
                                                                      item.type === "alert"
                                                                           ? "fa-solid fa-bell"
                                                                           : "fa-solid fa-clock"
                                                                 }
                                                            ></i>
                                                       )}
                                                  </div>

                                                  <div>
                                                       <h4>{item.title}</h4>
                                                       <p>
                                                            {getDateLabel(itemDate)}
                                                            {itemTime ? ` • ${itemTime}` : ""}
                                                       </p>
                                                  </div>
                                             </div>
                                        );
                                   })
                              ) : (
                                   <div className="empty-notification">
                                        <i className="fa-solid fa-bell-slash"></i>
                                        <h3>No upcoming notifications</h3>
                                        <p>Create reminders or alerts using the form.</p>
                                   </div>
                              )}
                         </div>

                         <div className="notification-mail-preview">
                              <i className="fa-solid fa-envelope-circle-check"></i>
                              <div>
                                   <h4>Email Reminder Preview</h4>
                                   <p>Email notification will be sent when reminder or bill alert date is near.</p>
                              </div>
                         </div>
                    </div>
               </div>

               <div className="notifications-list-card">
                    <div className="notification-card-title">
                         <div>
                              <h3>All Reminders & Alerts</h3>
                              <p>Manage all your reminders and bill alerts in one place.</p>
                         </div>

                         <span>{allItems.length}</span>
                    </div>

                    <div className="notifications-list">
                         {pageLoading ? (
                              <div className="notification-loader-box">
                                   <span className="notification-loader"></span>
                                   <p>Loading reminders and alerts...</p>
                              </div>
                         ) : allItems.length > 0 ? (
                              allItems.map((item) => {
                                   const itemDate = getItemDate(item);
                                   const itemTime = getItemTime(item);
                                   const itemAmount = getItemAmount(item);
                                   const status = getStatus(item.type, itemDate);
                                   const id = getId(item);

                                   return (
                                        <div
                                             className={`notification-list-item ${status} ${item.is_read ? "read" : ""}`}
                                             key={id}
                                        >
                                             <div className="notification-list-left">
                                                  <div className="notification-list-icon">
                                                       <i
                                                            className={
                                                                 item.type === "alert"
                                                                      ? "fa-solid fa-file-invoice-dollar"
                                                                      : "fa-solid fa-calendar-check"
                                                            }
                                                       ></i>
                                                  </div>

                                                  <div>
                                                       <h4>{item.title}</h4>

                                                       <p>
                                                            <span className={`type-pill ${item.type}`}>
                                                                 {item.type === "alert" ? "Bill Alert" : "Reminder"}
                                                            </span>

                                                            {" "}
                                                            •{" "}

                                                            <span>{item.category || "Other"}</span>

                                                            {itemAmount && (
                                                                 <>
                                                                      {" "}
                                                                      •{" "}
                                                                      <strong>
                                                                           ₹ {Number(itemAmount).toLocaleString("en-IN")}
                                                                      </strong>
                                                                 </>
                                                            )}
                                                       </p>

                                                       {item.note && <small>{item.note}</small>}
                                                  </div>
                                             </div>

                                             <div className="notification-list-right">
                                                  <span className={`status-badge ${status}`}>
                                                       {getDateLabel(itemDate)}
                                                  </span>

                                                  <p>
                                                       {new Date(itemDate).toLocaleDateString("en-IN")}
                                                       {itemTime ? ` • ${itemTime}` : ""}
                                                  </p>

                                                  <div
                                                       style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                            justifyContent: "flex-end"
                                                       }}
                                                  >
                                                       {!item.is_read && (
                                                            <button
                                                                 type="button"
                                                                 title="Mark as read"
                                                                 disabled={actionLoadingId === id}
                                                                 onClick={() => handleRead(id)}
                                                            >
                                                                 {actionLoadingId === id ? (
                                                                      <span className="mini-spinner"></span>
                                                                 ) : (
                                                                      <i className="fa-solid fa-check"></i>
                                                                 )}
                                                            </button>
                                                       )}

                                                       <button
                                                            type="button"
                                                            title="Delete"
                                                            disabled={actionLoadingId === id}
                                                            onClick={() => openDeleteModal(id, item.title)}
                                                       >
                                                            <i className="fa-solid fa-trash"></i>
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   );
                              })
                         ) : (
                              <div className="empty-notification">
                                   <i className="fa-solid fa-bell-slash"></i>
                                   <h3>No reminders or alerts found</h3>
                                   <p>Create your first reminder or bill alert using the form.</p>
                              </div>
                         )}
                    </div>
               </div>

               {showDeleteModal && (
                    <div className="delete-overlay">
                         <div className="delete-box">
                              <div className="delete-icon">
                                   <i className="fa-solid fa-trash"></i>
                              </div>

                              <h3>Do you want to delete?</h3>

                              <p>
                                   Are you sure you want to delete{" "}
                                   <strong>{deleteItemTitle || "this notification"}</strong>?
                                   This action cannot be undone.
                              </p>

                              <div className="delete-actions">
                                   <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={closeDeleteModal}
                                        disabled={actionLoadingId === deleteItemId}
                                   >
                                        No, Cancel
                                   </button>

                                   <button
                                        type="button"
                                        className="confirm-delete-btn"
                                        onClick={handleDelete}
                                        disabled={actionLoadingId === deleteItemId}
                                   >
                                        {actionLoadingId === deleteItemId ? (
                                             <>
                                                  <span className="btn-spinner"></span>
                                                  Deleting...
                                             </>
                                        ) : (
                                             <>
                                                  Yes, Delete
                                                  <i className="fa-solid fa-trash"></i>
                                             </>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}