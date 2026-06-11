import React, { useState } from "react";
import "../css/reminders.css";
import Toast from "../components/toast";

export default function Reminders() {
     const [activeTab, setActiveTab] = useState("reminder");

     const [title, setTitle] = useState("");
     const [category, setCategory] = useState("");
     const [amount, setAmount] = useState("");
     const [date, setDate] = useState("");
     const [time, setTime] = useState("");
     const [note, setNote] = useState("");

     const [items, setItems] = useState([
          {
               id: 1,
               type: "reminder",
               title: "Review monthly expenses",
               category: "Personal",
               amount: "",
               date: "2026-06-18",
               time: "10:30",
               note: "Check spending summary and update budget.",
               status: "upcoming"
          },
          {
               id: 2,
               type: "alert",
               title: "Electricity bill due",
               category: "Bills & Utilities",
               amount: 1800,
               date: "2026-06-15",
               time: "09:00",
               note: "Pay before due date to avoid late fee.",
               status: "urgent"
          },
          {
               id: 3,
               type: "alert",
               title: "Internet bill payment",
               category: "Bills & Utilities",
               amount: 799,
               date: "2026-06-22",
               time: "11:00",
               note: "Monthly broadband bill reminder.",
               status: "upcoming"
          }
     ]);

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

     const reminderItems = items.filter((item) => item.type === "reminder");
     const alertItems = items.filter((item) => item.type === "alert");

     const urgentAlerts = alertItems.filter((item) => item.status === "urgent");

     const filteredItems = items.filter((item) => item.type === activeTab);

     const clearForm = () => {
          setTitle("");
          setCategory("");
          setAmount("");
          setDate("");
          setTime("");
          setNote("");
     };

     const handleSubmit = (e) => {
          e.preventDefault();

          if (!title || !date) {
               setShowToast(true);
               setToastMessage("Please enter title and date!");
               setToastMessageType("error");
               return;
          }

          const selectedDate = new Date(date);
          const currentDate = new Date(today);

          const diffTime = selectedDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const newItem = {
               id: Date.now(),
               type: activeTab,
               title,
               category: category || "Other",
               amount,
               date,
               time,
               note,
               status: activeTab === "alert" && diffDays <= 3 ? "urgent" : "upcoming"
          };

          setItems([newItem, ...items]);
          clearForm();

          setShowToast(true);
          setToastMessage(activeTab === "alert" ? "Alert created successfully!" : "Reminder created successfully!");
          setToastMessageType("success");
     };

     const handleDelete = (id) => {
          setItems(items.filter((item) => item.id !== id));

          setShowToast(true);
          setToastMessage("Notification deleted successfully!");
          setToastMessageType("success");
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

     return (
          <div className="notifications-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               {/* Header */}
               <div className="notifications-header">
                    <div>
                         <h1>Reminders & Alerts</h1>
                         <p>Create reminders and bill alerts to stay updated before due dates.</p>
                    </div>

                    <button>
                         <i className="fa-solid fa-bell"></i>
                         {items.length} Notifications
                    </button>
               </div>

               {/* Stats */}
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
                              <i className="fa-solid fa-envelope"></i>
                         </div>

                         <div>
                              <h5>Email Status</h5>
                              <h3>Ready</h3>
                         </div>
                    </div>
               </div>

               {/* Main Grid */}
               <div className="notifications-main-grid">

                    {/* Form */}
                    <div className="notification-form-card">
                         <div className="notification-tabs">
                              <button
                                   className={activeTab === "reminder" ? "active" : ""}
                                   onClick={() => setActiveTab("reminder")}
                              >
                                   <i className="fa-solid fa-clock"></i>
                                   Reminder
                              </button>

                              <button
                                   className={activeTab === "alert" ? "active" : ""}
                                   onClick={() => setActiveTab("alert")}
                              >
                                   <i className="fa-solid fa-bell"></i>
                                   Bill Alert
                              </button>
                         </div>

                         <div className="notification-form-title">
                              <h3>
                                   {activeTab === "alert" ? "Create Bill Alert" : "Create Reminder"}
                              </h3>
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
                                   />
                              </div>

                              <div className="form-row">
                                   <div className="form-group">
                                        <label>Category</label>
                                        <select
                                             value={category}
                                             onChange={(e) => setCategory(e.target.value)}
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
                                        />
                                   </div>

                                   <div className="form-group">
                                        <label>Time</label>
                                        <input
                                             type="time"
                                             value={time}
                                             onChange={(e) => setTime(e.target.value)}
                                        />
                                   </div>
                              </div>

                              <div className="form-group">
                                   <label>Note</label>
                                   <textarea
                                        placeholder="Write a short note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                   ></textarea>
                              </div>

                              <button className="save-notification-btn">
                                   {activeTab === "alert" ? "Save Alert" : "Save Reminder"}
                                   <i className="fa-solid fa-check"></i>
                              </button>
                         </form>
                    </div>

                    {/* Upcoming Box */}
                    <div className="notification-preview-card">
                         <div className="notification-card-title">
                              <div>
                                   <h3>Upcoming Notifications</h3>
                                   <p>Dashboard preview style</p>
                              </div>

                              <span>{items.length}</span>
                         </div>

                         <div className="dashboard-notification-box">
                              {items.slice(0, 4).map((item) => (
                                   <div
                                        className={`dashboard-notification-item ${item.status}`}
                                        key={item.id}
                                   >
                                        <div className="dashboard-notification-icon">
                                             <i
                                                  className={
                                                       item.type === "alert"
                                                            ? "fa-solid fa-bell"
                                                            : "fa-solid fa-clock"
                                                  }
                                             ></i>
                                        </div>

                                        <div>
                                             <h4>{item.title}</h4>
                                             <p>
                                                  {getDateLabel(item.date)}
                                                  {item.time ? ` • ${item.time}` : ""}
                                             </p>
                                        </div>
                                   </div>
                              ))}
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

               {/* List */}
               <div className="notifications-list-card">
                    <div className="notification-card-title">
                         <div>
                              <h3>
                                   {activeTab === "alert" ? "Bill Alerts" : "Reminders"}
                              </h3>
                              <p>
                                   Manage your {activeTab === "alert" ? "upcoming bill alerts" : "personal reminders"}.
                              </p>
                         </div>

                         <span>{filteredItems.length}</span>
                    </div>

                    <div className="notifications-list">
                         {filteredItems.length > 0 ? (
                              filteredItems.map((item) => (
                                   <div className={`notification-list-item ${item.status}`} key={item.id}>
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
                                                       <span>{item.category}</span>
                                                       {item.amount && (
                                                            <>
                                                                 {" "}
                                                                 •{" "}
                                                                 <strong>
                                                                      ₹ {Number(item.amount).toLocaleString("en-IN")}
                                                                 </strong>
                                                            </>
                                                       )}
                                                  </p>

                                                  {item.note && <small>{item.note}</small>}
                                             </div>
                                        </div>

                                        <div className="notification-list-right">
                                             <span className={`status-badge ${item.status}`}>
                                                  {getDateLabel(item.date)}
                                             </span>

                                             <p>
                                                  {new Date(item.date).toLocaleDateString("en-IN")}
                                                  {item.time ? ` • ${item.time}` : ""}
                                             </p>

                                             <button onClick={() => handleDelete(item.id)}>
                                                  <i className="fa-solid fa-trash"></i>
                                             </button>
                                        </div>
                                   </div>
                              ))
                         ) : (
                              <div className="empty-notification">
                                   <i className="fa-solid fa-bell-slash"></i>
                                   <h3>No {activeTab === "alert" ? "alerts" : "reminders"} found</h3>
                                   <p>Create your first {activeTab === "alert" ? "bill alert" : "reminder"} using the form.</p>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}