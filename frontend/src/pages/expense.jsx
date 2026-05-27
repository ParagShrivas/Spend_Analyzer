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

     return (

          <div className="expense-page">
               <Toast type={toastMessageType} message={toastMessage} show={showToast} setShow={setShowToast} />

               {/* Header */}

               <div className="top-header">

                    <div>

                         <h1>
                              Welcome back, John 👋
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

                         <div className="header-icon">
                              <i className="fa-regular fa-moon"></i>
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

                                        <span className="green">
                                             ▲ 12.5%
                                        </span>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon orange">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                   </div>

                                   <div>

                                        <h5>Total Expenses</h5>

                                        <h2>₹ 18,500</h2>

                                        <span className="red">
                                             ▲ 8.3%
                                        </span>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon purple">
                                        <i className="fa-solid fa-chart-pie"></i>
                                   </div>

                                   <div>

                                        <h5>Monthly Budget</h5>

                                        <h2>₹ 25,000</h2>

                                        <p>May 2026</p>

                                   </div>

                              </div>

                              <div className="stats-card">

                                   <div className="stats-icon greenbg">
                                        <i className="fa-solid fa-wallet"></i>
                                   </div>

                                   <div>

                                        <h5>Remaining Budget</h5>

                                        <h2>₹ 6,500</h2>

                                        <p className="green">
                                             26% Left
                                        </p>

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

                                        <div className="pie-chart"></div>

                                        <div className="pie-details">

                                             <div className="pie-item">

                                                  <span className="dot blue-dot"></span>

                                                  <p>
                                                       Food & Dining
                                                  </p>

                                                  <h5>₹ 7,200</h5>

                                             </div>

                                             <div className="pie-item">

                                                  <span className="dot orange-dot"></span>

                                                  <p>
                                                       Travel
                                                  </p>

                                                  <h5>₹ 3,400</h5>

                                             </div>

                                             <div className="pie-item">

                                                  <span className="dot purple-dot"></span>

                                                  <p>
                                                       Shopping
                                                  </p>

                                                  <h5>₹ 4,100</h5>

                                             </div>

                                             <div className="pie-item">

                                                  <span className="dot green-dot"></span>

                                                  <p>
                                                       Bills
                                                  </p>

                                                  <h5>₹ 2,800</h5>

                                             </div>

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

                                   <div className="graph-container">

                                        <div className="graph-line"></div>

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

                                   <input
                                        type="text"
                                        placeholder="Search..."
                                   />

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
                                             expenses.slice(0,5).map((expense, index) => (
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