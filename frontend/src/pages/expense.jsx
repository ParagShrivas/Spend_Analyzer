// pages/Expense.jsx

import React from "react";
import "../css/expense.css";
import Toast from "../components/toast";
import { useState, useEffect } from "react";

const Expense = () => {
     const [expenses, setExpenses] = useState([]);

     const [title, setTitle] = useState("");
     const [amount, setAmount] = useState("");
     const [category, setCategory] = useState("");
     const [date, setDate] = useState("");
     const [description, setDescription] = useState("");
     const [loading, setLoading] = useState(false);
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");

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

     const handleExpense = async (e) => {
          e.preventDefault();

          setLoading(true);
          try {
               const response = await fetch("http://localhost:1500/expense/add", {
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
               } else {
                    setShowToast(true);
                    setToastMessage("Error adding expense!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error adding expense:", error);
          } finally {
               setLoading(false);
          }

          // Reset Form
          setTitle("");
          setAmount("");
          setCategory("");
          setDate("");
          setDescription("");
     };

     useEffect(() => {
          const fetchExpenses = async () => {
               // Fetch expenses and stats here
               try {
                    const response = await fetch("http://localhost:1500/expense/get", {
                         method: "GET",
                         headers: {
                              "Content-Type": "application/json"
                         },
                         credentials: "include"
                    });

                    const data = await response.json();

                    if (response.ok) {
                         setExpenses(data);
                    } else {
                         setShowToast(true);
                         setToastMessage("Error fetching expenses!");
                         setToastMessageType("error");
                    }
               } catch (error) {
                    console.error("Error fetching data:", error);
               }
          }
          fetchExpenses();
     }, [])

     const categoryColors = {
          "Food & Dining": "#3b82f6",
          "Travel": "#cc6f2d",
          "Shopping": "#a855f7",
          "Bills & Utilities": "#2271c5",
          "Entertainment": "#ec4899",
          "Healthcare": "#ef4444",
          "Education": "#06b6d4",
          "Groceries": "#84cc16",
          "Salary": "#14b8a6",
          "Investment": "#6366f1",
          "Other": "#64748b"
     };

     const categoryTotals = expenses.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     const totalExpense = Object.values(categoryTotals).reduce(
          (total, amount) => total + amount,
          0
     );

     let currentPercent = 0;

     const pieGradient = Object.entries(categoryTotals)
          .map(([category, amount]) => {
               const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
               const start = currentPercent;
               const end = currentPercent + percent;

               currentPercent = end;

               return `${categoryColors[category] || categoryColors.Other} ${start}% ${end}%`;
          })
          .join(", ");

     const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
          category,
          amount: Number(amount),
          percentage: totalExpense > 0 ? (Number(amount) / totalExpense) * 100 : 0,
          color: categoryColors[category] || categoryColors.Other
     }));

     const createPieSlice = (startAngle, endAngle, radius = 80, center = 100) => {
          const start = {
               x: center + radius * Math.cos((Math.PI * startAngle) / 180),
               y: center + radius * Math.sin((Math.PI * startAngle) / 180)
          };

          const end = {
               x: center + radius * Math.cos((Math.PI * endAngle) / 180),
               y: center + radius * Math.sin((Math.PI * endAngle) / 180)
          };

          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

          return `
          M ${center} ${center}
          L ${start.x} ${start.y}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
          Z
     `;
     };

     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

     const currentDate = new Date();

     const lastSixMonths = Array.from({ length: 6 }, (_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);

          return {
               month: monthNames[date.getMonth()],
               monthIndex: date.getMonth(),
               year: date.getFullYear(),
               total: 0
          };
     });

     expenses.forEach((expense) => {
          const expenseDate = new Date(expense.created_at);
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

     const maxMonthlyExpense = Math.max(...lastSixMonths.map((item) => item.total), 1);

     return (

          <div className="expense-page">
               <Toast type={toastMessageType} message={toastMessage} show={showToast} setShow={setShowToast} />

               {/* Header */}

               <div className="top-header">

                    <div>

                         <h1>
                              Welcome back 👋
                         </h1>

                         <p>
                              Here's what's happening with your expenses today.
                         </p>

                    </div>

                    <div className="header-right">

                         <div className="search-box">

                              <i className="fa-solid fa-magnifying-glass"></i>

                              <input
                                   type="text"
                                   placeholder="Search expenses..."
                              />

                         </div>

                         <div className="header-icon">
                              <i className="fa-regular fa-bell"></i>
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

                                        <h5>Total Balance</h5>

                                        <h2>₹ 50,000</h2>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon orange">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                   </div>

                                   <div>

                                        <h5>Total Expenses</h5>

                                        <h2>₹ {totalExpense}</h2>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon purple">
                                        <i className="fa-solid fa-chart-pie"></i>
                                   </div>

                                   <div>

                                        <h5>Monthly Budget</h5>

                                        <h2>₹ 25,000</h2>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon greenbg">
                                        <i className="fa-solid fa-wallet"></i>
                                   </div>

                                   <div>

                                        <h5>Remaining Budget</h5>

                                        <h2>₹ 6,500</h2>

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
                                             This Month
                                        </button>
                                   </div>

                                   <div className="pie-content">
                                        <div className="pie-chart">
                                             {totalExpense > 0 ? (
                                                  <svg viewBox="0 0 200 200" width="100%" height="100%">
                                                       {(() => {
                                                            let startAngle = -90;

                                                            return pieData.map((item) => {
                                                                 const angle = (item.percentage / 100) * 360;
                                                                 const endAngle = startAngle + angle;
                                                                 const midAngle = startAngle + angle / 2;

                                                                 const labelRadius = 55;

                                                                 const labelX =
                                                                      100 + labelRadius * Math.cos((Math.PI * midAngle) / 180);

                                                                 const labelY =
                                                                      100 + labelRadius * Math.sin((Math.PI * midAngle) / 180);

                                                                 const path = createPieSlice(startAngle, endAngle);

                                                                 startAngle = endAngle;

                                                                 return (
                                                                      <g key={item.category}>
                                                                           <path d={path} fill={item.color} />

                                                                           {item.percentage >= 5 && (
                                                                                <text
                                                                                     x={labelX}
                                                                                     y={labelY}
                                                                                     textAnchor="middle"
                                                                                     dominantBaseline="middle"
                                                                                     fill="#fff"
                                                                                     fontSize="12"
                                                                                     fontWeight="700"
                                                                                >
                                                                                     {item.percentage.toFixed(0)}%
                                                                                </text>
                                                                           )}
                                                                      </g>
                                                                 );
                                                            });
                                                       })()}

                                                       <circle cx="100" cy="100" r="38" fill="#fff" />

                                                       <text
                                                            x="100"
                                                            y="95"
                                                            textAnchor="middle"
                                                            fontSize="13"
                                                            fontWeight="700"
                                                            fill="#111827"
                                                       >
                                                            Total
                                                       </text>

                                                       <text
                                                            x="100"
                                                            y="113"
                                                            textAnchor="middle"
                                                            fontSize="12"
                                                            fontWeight="600"
                                                            fill="#374151"
                                                       >
                                                            ₹{totalExpense.toLocaleString("en-IN")}
                                                       </text>
                                                  </svg>
                                             ) : (
                                                  <div className="empty-chart">0%</div>
                                             )}
                                        </div>
                                        <div className="pie-details">
                                             {Object.keys(categoryTotals).length > 0 ? (
                                                  Object.entries(categoryTotals).map(([category, amount], index) => (
                                                       <div className="pie-item" key={category}>
                                                            <span
                                                                 className="dot"
                                                                 style={{
                                                                      backgroundColor:
                                                                           categoryColors[category] || categoryColors.Other
                                                                 }}
                                                            ></span>

                                                            <p>{category}</p>

                                                            <h5>
                                                                 ₹ {Number(amount).toLocaleString("en-IN")}
                                                            </h5>
                                                       </div>
                                                  ))
                                             ) : (
                                                  <p>No expense data found.</p>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              {/* Graph */}

                              <div className="glass-card">
                                   <div className="card-title">
                                        <h3>
                                             Monthly Trend
                                        </h3>

                                        <button>
                                             6 Months
                                        </button>
                                   </div>

                                   <div className="bar-graph-container">
                                        {lastSixMonths.map((item) => {
                                             const barHeight = (item.total / maxMonthlyExpense) * 100;

                                             return (
                                                  <div className="bar-item" key={`${item.month}-${item.year}`}>
                                                       <div className="bar-value">
                                                            ₹{Number(item.total).toLocaleString("en-IN")}
                                                       </div>

                                                       <div className="bar-track">
                                                            <div
                                                                 className="bar-fill"
                                                                 style={{
                                                                      height: `${barHeight}%`
                                                                 }}
                                                            ></div>
                                                       </div>

                                                       <p>{item.month}</p>
                                                  </div>
                                             );
                                        })}
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
                                        onChange={(e) =>
                                             setDate(e.target.value)
                                        }
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

               <div className="bottom-grid">

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
                                                  <p>{new Date(expense.date).toLocaleDateString()}</p>
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

                                   <select>
                                        <option>
                                             All Categories
                                        </option>
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

                                        {expenses.length > 0 ? (
                                             expenses.slice(0, 5).map((expense, index) => (
                                                  <tr key={expense.expense_id || index}>
                                                       <td>{index + 1}</td>
                                                       <td>{expense.title}</td>
                                                       <td>{expense.category}</td>
                                                       <td className="amount">₹ {expense.amount}</td>
                                                       <td>{new Date(expense.created_at).toLocaleDateString()}</td>
                                                       <td>
                                                            <button className="edit-btn">
                                                                 <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                            <button className="delete-btn">
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

                    </div>

               </div>

          </div>
     );
};

export default Expense;