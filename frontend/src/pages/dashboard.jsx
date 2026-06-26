// pages/Dashboard.jsx

import React from "react";
import "../css/dashboard.css";
import Toast from "../components/toast";
import { useExpenses } from '../context/ExpenseContext';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import Footer from "../components/footer";

import {
     Chart as ChartJS,
     ArcElement,
     BarElement,
     CategoryScale,
     LinearScale,
     Tooltip,
     Legend
} from "chart.js";

ChartJS.register(
     ArcElement,
     BarElement,
     CategoryScale,
     LinearScale,
     Tooltip,
     Legend
);

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
     // navigate 
     const navigate = useNavigate();
     // expense
     const { expenses, setExpenses, fetchExpenses, expenseLoading } = useExpenses();

     // notifications
     const [notifications, setNotifications] = useState([]);
     const [showNotifications, setShowNotifications] = useState(false);

     // budget
     const [budget, setBudget] = useState(0)

     // form
     const [title, setTitle] = useState("");
     const [amount, setAmount] = useState("");
     const [category, setCategory] = useState("");
     const [date, setDate] = useState("");
     const [description, setDescription] = useState("");

     // loading and toast
     const [loading, setLoading] = useState(false);
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");

     // edit expense
     const [showEditOverlay, setShowEditOverlay] = useState(false);
     const [editExpenseId, setEditExpenseId] = useState(null);

     // delete confirmation
     const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
     const [selectedExpenseId, setSelectedExpenseId] = useState(null);

     // pagination and filtering
     const [currentPage, setCurrentPage] = useState(1);
     const [selectedCategory, setSelectedCategory] = useState("All Categories");

     const itemsPerPage = 5;

     const categories = [
          "Food & Dining",
          "Travel",
          "Shopping",
          "Bills & Utilities",
          "Entertainment",
          "Healthcare",
          "Education",
          "Groceries",
          "Salary",
          "Investment",
          "Other"
     ];

     const filteredExpenses = selectedCategory === "All Categories"
          ? expenses
          : expenses.filter((expense) => expense.category === selectedCategory);

     const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

     const paginatedExpenses = filteredExpenses.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
     );

     const categoryIcons = {
          "Food & Dining": "🍔",
          "Travel": "🚕",
          "Shopping": "🛍️",
          "Bills & Utilities": "⚡",
          "Entertainment": "🎬",
          "Healthcare": "🏥",
          "Education": "📚",
          "Groceries": "🛒",
          "Salary": "💰",
          "Investment": "📈",
          "Other": "📦"
     };

     // fetch notifications
     const fetchNotifications = async () => {
          try {
               const response = await fetch("https://spend-analyzer-jg2g.onrender.com/notification/get", {
                    method: "GET",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await response.json();

               if (response.ok) {
                    setNotifications(data);
               } else {
                    console.error("Error fetching notifications:", data.message);
               }
          } catch (error) {
               console.error("Error fetching notifications:", error);
          }
     };

     // add expense
     const handleExpense = async (e) => {
          e.preventDefault();

          setLoading(true);
          try {
               const response = await fetch("https://spend-analyzer-jg2g.onrender.com/expense/add", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         title,
                         amount,
                         category,
                         date,
                         description
                    })
               });

               const data = await response.json();

               if (response.ok) {
                    setShowToast(true);
                    setToastMessage("Expense added successfully!");
                    setToastMessageType("success");
                    fetchExpenses();
               } else {
                    setShowToast(true);
                    setToastMessage("Error adding expense!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error adding expense:", error);
          } finally {
               setLoading(false);
               fetchExpenses();
          }

          // Reset Form
          setTitle("");
          setAmount("");
          setCategory("");
          setDate("");
          setDescription("");
     };

     // delete expense
     const handleDelete = async () => {
          if (!selectedExpenseId) return;

          setShowDeleteOverlay(false);
          try {
               const response = await fetch(`https://spend-analyzer-jg2g.onrender.com/expense/delete/${selectedExpenseId}`, {
                    method: "DELETE",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               });

               const data = await response.json();

               if (response.ok) {
                    setShowToast(true);
                    setToastMessage("Expense deleted successfully!");
                    setToastMessageType("success");
                    fetchExpenses();
               } else {
                    setShowToast(true);
                    setToastMessage("Error deleting expense!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error deleting expense:", error);
               setShowToast(true);
               setToastMessage("Error deleting expense!");
               setToastMessageType("error");
          }
     }

     // fetch budget
     const fetchBudget = async () => {
          try {
               const response = await fetch("https://spend-analyzer-jg2g.onrender.com/budget/get", {
                    method: 'GET',
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               })

               const data = await response.json();

               if (response.ok) {
                    if (data.length > 0) {
                         setBudget(data[0].budget_amount);
                    }
               } else {
                    setShowToast(true);
                    setToastMessage("Error fetching budget!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.log('Error', error);
          }
     }

     useEffect(() => {
          fetchExpenses();
          fetchBudget();
          fetchNotifications();
     }, [])

     const categoryColors = {
          "Food & Dining": "#15d8ea",
          "Travel": "#cc6f2d",
          "Shopping": "#a855f7",
          "Bills & Utilities": "#2271c5",
          "Entertainment": "#ec4899",
          "Healthcare": "#ef4444",
          "Education": "#06b6d4",
          "Groceries": "#84cc16",
          "Salary": "#14b8a6",
          "Investment": "#6366f1",
          "Other": "#048fab"
     };

     // monthly expense 
     const currentMonth = new Date().getMonth();
     const currentYear = new Date().getFullYear();

     // Get only current month expenses
     const currentMonthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.expense_date || expense.created_at);

          return (
               expenseDate.getMonth() === currentMonth &&
               expenseDate.getFullYear() === currentYear
          );
     });

     // Current month total expense
     const monthlyTotalExpense = currentMonthExpenses.reduce(
          (total, expense) => total + Number(expense.amount || 0),
          0
     );

     // Category wise total for current month
     const currentMonthCategoryTotals = currentMonthExpenses.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     // Highest spending category this month
     const highestCategory = Object.entries(currentMonthCategoryTotals).sort(
          (a, b) => b[1] - a[1]
     )[0] || ["No Data", 0];

     const categoryTotals = expenses.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     const totalExpense = Object.values(categoryTotals).reduce(
          (total, amount) => total + Number(amount),
          0
     );

     const pieChartData = {
          labels: Object.keys(currentMonthCategoryTotals),
          datasets: [
               {
                    data: Object.values(currentMonthCategoryTotals).map((amount) =>
                         Number(amount)
                    ),
                    backgroundColor: Object.keys(currentMonthCategoryTotals).map(
                         (category) =>
                              categoryColors[category] || categoryColors.Other
                    ),
                    borderWidth: 2,
                    borderColor: "#ffffff"
               }
          ]
     };

     const pieChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
               legend: {
                    display: false
               },
               tooltip: {
                    callbacks: {
                         label: function (context) {
                              const value = context.raw;
                              const percentage = totalExpense > 0
                                   ? ((value / totalExpense) * 100).toFixed(1)
                                   : 0;

                              return `${context.label}: ₹${Number(value).toLocaleString("en-IN")} (${percentage}%)`;
                         }
                    }
               }
          }
     };

     // bar graph
     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

     const currentDate = new Date();

     const lastSixMonths = Array.from({ length: 6 }, (_, index) => {
          const date = new Date(
               currentDate.getFullYear(),
               currentDate.getMonth() - (5 - index),
               1
          );

          return {
               month: monthNames[date.getMonth()],
               monthIndex: date.getMonth(),
               year: date.getFullYear(),
               total: 0
          };
     });

     expenses.forEach((expense) => {
          const expenseDate = new Date(expense.expense_date || expense.created_at);
          const amount = Number(expense.amount || 0);

          const matchedMonth = lastSixMonths.find(
               (item) =>
                    item.monthIndex === expenseDate.getMonth() &&
                    item.year === expenseDate.getFullYear()
          );

          if (matchedMonth) {
               matchedMonth.total += amount;
          }
     });

     const monthlyBarData = {
          labels: lastSixMonths.map((item) => item.month),
          datasets: [
               {
                    label: "Monthly Expense",
                    data: lastSixMonths.map((item) => item.total),
                    backgroundColor: "#0ea5e9",
                    borderRadius: 12,
                    barThickness: 35
               }
          ]
     };

     const monthlyBarOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
               legend: {
                    display: false
               },
               tooltip: {
                    callbacks: {
                         label: function (context) {
                              return `₹ ${Number(context.raw).toLocaleString("en-IN")}`;
                         }
                    }
               }
          },
          scales: {
               x: {
                    grid: {
                         display: false
                    }
               },
               y: {
                    beginAtZero: true,
                    ticks: {
                         callback: function (value) {
                              return `₹${Number(value).toLocaleString("en-IN")}`;
                         }
                    }
               }
          }
     };


     // handle edit click
     const handleEditClick = (expense) => {
          setEditExpenseId(expense.expense_id || expense.id);

          setTitle(expense.title);
          setAmount(expense.amount);
          setCategory(expense.category);
          setDate(expense.expense_date?.split("T")[0] || expense.created_at?.split("T")[0]);
          setDescription(expense.description || "");

          setShowEditOverlay(true);
     };

     // update expense
     const handleUpdateExpense = async (e) => {
          e.preventDefault();

          if (!editExpenseId) return;

          setLoading(true);

          try {
               const response = await fetch(`https://spend-analyzer-jg2g.onrender.com/expense/update/${editExpenseId}`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         title,
                         amount,
                         category,
                         date,
                         description
                    })
               });

               const data = await response.json();

               if (response.ok) {
                    setShowToast(true);
                    setToastMessage("Expense updated successfully!");
                    setToastMessageType("success");

                    setShowEditOverlay(false);
                    setEditExpenseId(null);

                    setTitle("");
                    setAmount("");
                    setCategory("");
                    setDate("");
                    setDescription("");

                    fetchExpenses();
               } else {
                    setShowToast(true);
                    setToastMessage(data.message || "Error updating expense!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error updating expense:", error);

               setShowToast(true);
               setToastMessage("Error updating expense!");
               setToastMessageType("error");
          } finally {
               setLoading(false);
          }
     };



     return (

          <div className="expense-page">
               <Toast type={toastMessageType} message={toastMessage} show={showToast} setShow={setShowToast} />

               {/* Header */}

               <div className="top-header">

                    <div>
                         <span className="profile-eyebrow">FINANCIAL OVERVIEW</span>

                         <h1>
                              Welcome back 👋
                         </h1>

                         <p>
                              Here's what's happening with your expenses today.
                         </p>

                    </div>

                    <div className="header-right">

                         <div className="notification-wrapper">
                              <div
                                   className="header-icon notification-header-icon"
                                   onClick={() => setShowNotifications(!showNotifications)}
                              >
                                   <i className="fa-regular fa-bell"></i>

                                   {notifications.length >= 0 && (
                                        <span className="notification-count">
                                             {notifications.length}
                                        </span>
                                   )}
                              </div>

                              {showNotifications && (
                                   <div className="notification-dropdown">
                                        <div className="notification-dropdown-header">
                                             <h4>Recent Notifications</h4>
                                             <span>{notifications.length}</span>
                                        </div>

                                        <div className="notification-dropdown-list">
                                             {notifications.length > 0 ? (
                                                  notifications.slice(0, 4).map((item) => (
                                                       <div className="notification-dropdown-item" key={item.id}>
                                                            <div className="notification-dropdown-icon">
                                                                 <i className="fa-solid fa-bell"></i>
                                                            </div>

                                                            <div>
                                                                 <h5>{item.title}</h5>
                                                                 <p>{item.note}</p>
                                                                 <small>{item.notify_time}</small>
                                                            </div>
                                                       </div>
                                                  ))
                                             ) : (
                                                  <div className="notification-empty">
                                                       <i className="fa-regular fa-bell-slash"></i>
                                                       <p>No notifications found</p>
                                                  </div>
                                             )}
                                        </div>

                                        <button onClick={() => navigate("/reminders")} className="view-all-notification-btn" >
                                             View All Notifications
                                        </button>
                                   </div>
                              )}
                         </div>

                    </div>

               </div>

               {/* Top Grid */}

               <div className="top-grid">

                    {/* Left Side */}

                    <div className="left-side">

                         {/* Stats */}

                         <div className="stats-grid">

                              <div className="stats-card">
                                   <div className="stats-icon blue">
                                        <i className="fa-solid fa-wallet"></i>
                                   </div>

                                   <div>
                                        <h5>Lifetime Expense</h5>

                                        <h2>
                                             ₹ {totalExpense.toLocaleString("en-IN")}
                                        </h2>
                                   </div>
                              </div>

                              <div className="stats-card">
                                   <div className="stats-icon orange">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                   </div>

                                   <div>
                                        <h5>Total Expenses</h5>

                                        <h3>
                                             ₹ {Number(monthlyTotalExpense || 0).toLocaleString("en-IN")}
                                        </h3>

                                        <small>{currentMonth + 1}/{currentYear}</small>
                                   </div>
                              </div>

                              <div className="stats-card">
                                   <div className="stats-icon purple">
                                        <i className="fa-solid fa-chart-pie"></i>
                                   </div>

                                   <div>
                                        <h5>Monthly Budget</h5>

                                        <h3>
                                             ₹ {Number(budget || 0).toLocaleString("en-IN")}
                                        </h3>

                                        <small>{currentMonth + 1}/{currentYear}</small>
                                   </div>
                              </div>

                              <div className="stats-card">
                                   <div className="stats-icon greenbg">
                                        <i className="fa-solid fa-ranking-star"></i>
                                   </div>

                                   <div>
                                        <h5>Highest Category</h5>

                                        <h6 style={{ fontSize: '15.5px' }}>
                                             {highestCategory[0]}
                                        </h6>

                                        <small>
                                             ₹ {Number(highestCategory[1]).toLocaleString("en-IN")} this month
                                        </small>
                                   </div>
                              </div>

                         </div>
                         {/* Charts */}

                         <div className="chart-grid">

                              {/* Pie Chart */}

                              <div className="glass-card">
                                   <div className="card-title">
                                        <h3>Expense Overview</h3>

                                        <button>
                                             {new Date().toLocaleString("en-IN", {
                                                  month: "long",
                                                  year: "numeric"
                                             })}
                                        </button>
                                   </div>

                                   <div className="pie-content">
                                        <div className="pie-chart mb-2">
                                             {totalExpense > 0 ? (
                                                  <Pie data={pieChartData} options={pieChartOptions} />
                                             ) : (
                                                  <div className="empty-chart">0%</div>
                                             )}
                                        </div>

                                        <div className="pie-details">
                                             {Object.keys(categoryTotals).length > 0 ? (
                                                  Object.entries(categoryTotals).map(([category, amount]) => {
                                                       const percentage = totalExpense > 0
                                                            ? ((Number(amount) / totalExpense) * 100).toFixed(1)
                                                            : 0;

                                                       return (
                                                            <div className="pie-item" key={category}>
                                                                 <span
                                                                      className="dot"
                                                                      style={{
                                                                           backgroundColor:
                                                                                categoryColors[category] || categoryColors.Other
                                                                      }}
                                                                 ></span>

                                                                 <p>
                                                                      {category}
                                                                      <small className="percentage-text mx-3">
                                                                           {percentage}%
                                                                      </small>
                                                                 </p>

                                                                 <h5>
                                                                      ₹ {Number(amount).toLocaleString("en-IN")}
                                                                 </h5>
                                                            </div>
                                                       );
                                                  })
                                             ) : (
                                                  <p>No expense data found.</p>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              {/* Bar Graph */}

                              <div className="glass-card">
                                   <div className="card-title">
                                        <h3>
                                             Monthly Trend
                                        </h3>

                                        <button>
                                             6 Months
                                        </button>
                                   </div>

                                   <div className="monthly-bar-chart">
                                        <Bar data={monthlyBarData} options={monthlyBarOptions} />
                                   </div>
                              </div>

                         </div>

                    </div>

                    {/* Right Side Form */}

                    <div className="expense-form-card">

                         <div className="form-title">

                              <div className="form-icon">

                                   <i className="fa-solid fa-pen"></i>

                              </div>

                              <div>

                                   <h3>Add Expense</h3>

                                   <p>
                                        Add a new expense to track your spending
                                   </p>

                              </div>

                         </div>
                         {/* Add Expense Form */}
                         <form onSubmit={handleExpense}>

                              {/* Title */}

                              <div className="form-group">

                                   <label>
                                        Title
                                   </label>

                                   <input
                                        type="text"
                                        placeholder="Enter expense title"
                                        value={title}
                                        onChange={(e) =>
                                             setTitle(e.target.value)
                                        }
                                        required
                                   />

                              </div>

                              {/* Amount */}

                              <div className="form-group">

                                   <label>
                                        Amount
                                   </label>

                                   <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) =>
                                             setAmount(e.target.value)
                                        }
                                        required
                                   />

                              </div>

                              {/* Category */}

                              <div className="form-group">

                                   <label>
                                        Category
                                   </label>

                                   <select
                                        value={category}
                                        onChange={(e) =>
                                             setCategory(e.target.value)
                                        }
                                        required
                                   >

                                        <option value="">
                                             Select category
                                        </option>

                                        <option value="Food & Dining">
                                             🍔 Food & Dining
                                        </option>

                                        <option value="Travel">
                                             🚕 Travel
                                        </option>

                                        <option value="Shopping">
                                             🛍️ Shopping
                                        </option>

                                        <option value="Bills & Utilities">
                                             ⚡ Bills & Utilities
                                        </option>

                                        <option value="Entertainment">
                                             🎬 Entertainment
                                        </option>

                                        <option value="Healthcare">
                                             🏥 Healthcare
                                        </option>

                                        <option value="Education">
                                             📚 Education
                                        </option>

                                        <option value="Groceries">
                                             🛒 Groceries
                                        </option>

                                        <option value="Salary">
                                             💰 Salary
                                        </option>

                                        <option value="Investment">
                                             📈 Investment
                                        </option>

                                        <option value="Other">
                                             📦 Other
                                        </option>

                                   </select>

                              </div>

                              {/* Date */}

                              <div className="form-group">
                                   <label>
                                        Date
                                   </label>

                                   <input
                                        type="date"
                                        value={date}
                                        max={new Intl.DateTimeFormat("en-CA", {
                                             timeZone: "Asia/Kolkata",
                                             year: "numeric",
                                             month: "2-digit",
                                             day: "2-digit"
                                        }).format(new Date())}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                   />
                              </div>

                              {/* Description */}

                              <div className="form-group">

                                   <label>
                                        Description
                                   </label>

                                   <textarea
                                        rows="4"
                                        placeholder="Add a note..."
                                        value={description}
                                        onChange={(e) =>
                                             setDescription(e.target.value)
                                        }
                                   ></textarea>

                              </div>

                              {/* Button */}

                              <button
                                   className="add-expense-btn"
                                   disabled={loading}
                              >

                                   {
                                        loading ? (
                                             <>
                                                  Adding...
                                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                             </>
                                        ) : (
                                             <>
                                                  Add Expense
                                                  <i className="fa-solid fa-plus"></i>
                                             </>
                                        )
                                   }

                              </button>

                         </form>


                    </div>

               </div>

               {/* Bottom Grid */}

               <div className="bottom-grid mb-4">

                    {/* Recent Expenses */}

                    <div className="glass-card">

                         <div className="card-title">

                              <h3>Recent Expenses</h3>

                              <button>See All</button>

                         </div>

                         <div className="recent-list">
                              {expenses.length > 0 ? (
                                   expenses.slice(0, 5).map((expense, index) => (
                                        <div className="recent-item" key={expense.expense_id || index}>
                                             <div className="recent-left">
                                                  <div className={`recent-icon ${index % 2 === 0 ? "orange" : "blue"}`}>
                                                       {categoryIcons[expense.category] || "📦"}
                                                  </div>

                                                  <div>
                                                       <h4>{expense.title}</h4>
                                                       <p>{expense.category}</p>
                                                  </div>
                                             </div>

                                             <div>
                                                  <h4>₹ {expense.amount}</h4>
                                                  <p>{new Date(expense.created_at).toLocaleDateString()}</p>
                                             </div>
                                        </div>
                                   ))
                              ) : (
                                   <p>No recent expenses found.</p>
                              )}
                         </div>

                    </div>

                    {/* All Expenses */}

                    <div className="glass-card table-card">

                         <div className="card-title">

                              <h3>All Expenses</h3>

                              <div className="table-actions">

                                   <select
                                        value={selectedCategory}
                                        onChange={(e) => {
                                             setSelectedCategory(e.target.value);
                                             setCurrentPage(1);
                                        }}
                                   >
                                        <option value="All Categories">
                                             All Categories
                                        </option>

                                        {categories.map((category) => (
                                             <option key={category} value={category}>
                                                  {category}
                                             </option>
                                        ))}
                                   </select>

                              </div>

                         </div>

                         <div className="table-responsive">

                              <table>

                                   <thead>
                                        <tr>
                                             <th>#</th>
                                             <th>Title</th>
                                             <th>Category</th>
                                             <th>Amount</th>
                                             <th>Date</th>
                                             <th>Actions</th>
                                        </tr>
                                   </thead>

                                   <tbody>

                                        {paginatedExpenses.length > 0 ? (
                                             paginatedExpenses.map((expense, index) => (
                                                  <tr key={expense.expense_id || expense.id || index}>
                                                       <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                                                       <td>{expense.title}</td>

                                                       <td>{expense.category}</td>

                                                       <td className="amount">
                                                            ₹ {Number(expense.amount).toLocaleString("en-IN")}
                                                       </td>

                                                       <td>
                                                            {new Date(expense.expense_date).toLocaleDateString("en-IN")}
                                                       </td>

                                                       <td>
                                                            <button
                                                                 className="edit-btn"
                                                                 onClick={() => handleEditClick(expense)}
                                                            >
                                                                 <i className="fa-solid fa-pen"></i>
                                                            </button>

                                                            <button
                                                                 className="delete-btn"
                                                                 onClick={() => {
                                                                      setSelectedExpenseId(expense.expense_id || expense.id);
                                                                      setShowDeleteOverlay(true);
                                                                 }}
                                                            >
                                                                 <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                       </td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="6" style={{ textAlign: "center" }}>
                                                       No expenses found. Start adding some!
                                                  </td>
                                             </tr>
                                        )}

                                   </tbody>

                              </table>

                         </div>

                         {totalPages > 1 && (
                              <div className="pagination-box">

                                   <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                   >
                                        Previous
                                   </button>

                                   {[...Array(totalPages)].map((_, index) => (
                                        <button
                                             key={index}
                                             className={currentPage === index + 1 ? "active-page" : ""}
                                             onClick={() => setCurrentPage(index + 1)}
                                        >
                                             {index + 1}
                                        </button>
                                   ))}

                                   <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                   >
                                        Next
                                   </button>

                              </div>
                         )}

                    </div>

               </div>
               {/* delete confirmation */}
               {showDeleteOverlay && (
                    <div className="delete-overlay">
                         <div className="delete-box">
                              <div className="delete-icon">
                                   <i className="fa-solid fa-trash"></i>
                              </div>

                              <h3>Delete Expense?</h3>

                              <p>Are you sure you want to delete this expense?</p>

                              <div className="delete-actions">
                                   <button
                                        className="confirm-delete-btn"
                                        onClick={handleDelete}
                                   >
                                        Yes
                                   </button>
                                   <button
                                        className="cancel-delete-btn"
                                        onClick={() => {
                                             setShowDeleteOverlay(false);
                                        }}
                                   >
                                        No
                                   </button>

                              </div>
                         </div>
                    </div>
               )}

               {/* edit expense form */}
               {showEditOverlay && (
                    <div className="edit-overlay">
                         <div className="edit-box">

                              <div className="edit-header">
                                   <div>
                                        <h3>Edit Expense</h3>
                                        <p>Update your selected expense details</p>
                                   </div>

                                   <button
                                        className="edit-close-btn"
                                        onClick={() => {
                                             setShowEditOverlay(false);
                                             setEditExpenseId(null);
                                        }}
                                   >
                                        <i className="fa-solid fa-xmark"></i>
                                   </button>
                              </div>

                              <form onSubmit={handleUpdateExpense}>

                                   <div className="form-group">
                                        <label>Title</label>
                                        <input
                                             type="text"
                                             placeholder="Enter expense title"
                                             value={title}
                                             onChange={(e) => setTitle(e.target.value)}
                                             required
                                        />
                                   </div>

                                   <div className="form-group">
                                        <label>Amount</label>
                                        <input
                                             type="number"
                                             placeholder="Enter amount"
                                             value={amount}
                                             onChange={(e) => setAmount(e.target.value)}
                                             required
                                        />
                                   </div>

                                   <div className="form-group">
                                        <label>Category</label>

                                        <select
                                             value={category}
                                             onChange={(e) => setCategory(e.target.value)}
                                             required
                                        >
                                             <option value="">Select category</option>

                                             {categories.map((cat) => (
                                                  <option key={cat} value={cat}>
                                                       {cat}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <div className="form-group">
                                        <label>Date</label>

                                        <input
                                             type="date"
                                             value={date}
                                             max={new Intl.DateTimeFormat("en-CA", {
                                                  timeZone: "Asia/Kolkata",
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit"
                                             }).format(new Date())}
                                             onChange={(e) => setDate(e.target.value)}
                                             required
                                        />
                                   </div>

                                   <div className="form-group">
                                        <label>Description</label>

                                        <textarea
                                             rows="4"
                                             placeholder="Add a note..."
                                             value={description}
                                             onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                   </div>

                                   <div className="edit-actions">
                                        <button
                                             type="button"
                                             className="cancel-edit-btn"
                                             onClick={() => {
                                                  setShowEditOverlay(false);
                                                  setEditExpenseId(null);
                                                  setTitle("");
                                                  setAmount("");
                                                  setCategory("");
                                                  setDate("");
                                                  setDescription("");
                                             }}
                                        >
                                             Cancel
                                        </button>

                                        <button
                                             type="submit"
                                             className="update-expense-btn"
                                             disabled={loading}
                                        >
                                             {loading ? (
                                                  <>
                                                       Updating...
                                                       <i className="fa-solid fa-spinner fa-spin"></i>
                                                  </>
                                             ) : (
                                                  <>
                                                       Update Expense
                                                       <i className="fa-solid fa-pen"></i>
                                                  </>
                                             )}
                                        </button>
                                   </div>

                              </form>
                         </div>
                    </div>
               )}
               <Footer />

          </div>
     );
};

export default Dashboard;