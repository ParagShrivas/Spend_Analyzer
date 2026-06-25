import React, { useEffect, useState } from "react";
import "../css/budget.css";
import { useExpenses } from "../context/ExpenseContext";
import Toast from "../components/toast";

export default function Budget() {

     // States

     const { expenses, setExpenses, fetchExpenses, expenseLoading } = useExpenses();

     const [monthlyBudget, setMonthlyBudget] = useState(0);

     const [newBudget, setNewBudget] = useState("");

     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");


     // Categories

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

     const categoryColors = {
          "Food & Dining": "#21d4aa",
          "Travel": "#f97316",
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

     // Current Month Expenses

     const currentMonth = new Date().getMonth();
     const currentYear = new Date().getFullYear();

     const currentMonthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.expense_date || expense.created_at);

          return (
               expenseDate.getMonth() === currentMonth &&
               expenseDate.getFullYear() === currentYear
          );
     });

     const monthlySpent = currentMonthExpenses.reduce(
          (total, expense) => total + Number(expense.amount || 0),
          0
     );

     const remainingBudget = monthlyBudget - monthlySpent;

     const budgetUsedPercent =
          monthlyBudget > 0 ? Math.min((monthlySpent / monthlyBudget) * 100, 100) : 0;


     // Category Wise Monthly Spending

     const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     const highestCategory =
          Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

     // fetch budget
     const fetchBudget = async () => {
          try {
               const response = await fetch("https://spend-analyzer-five.vercel.app/budget/get", {
                    method: 'GET',
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include"
               })

               const data = await response.json();

               if (response.ok) {
                    if (data.length > 0) {
                         setMonthlyBudget(data[0].budget_amount);
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

     // mount budget 
     useState(()=>{
          fetchBudget()
     })

     // Update Budget

     const handleBudgetUpdate = async(e) => {
          e.preventDefault();

          if (!newBudget || Number(newBudget) <= 0) {
               setShowToast(true);
               setToastMessage("Please enter a valid budget amount!");
               setToastMessageType("error");
               return;
          }

          try {
               const response = await fetch("https://spend-analyzer-five.vercel.app/budget/update", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         monthlyBudget: Number(newBudget)
                    })
               });

               const data = await response.json();
               if (!response.ok) {
                    setShowToast(true);
                    setToastMessage(data.message || "Error updating budget!");
                    setToastMessageType("error");
                    return;
               }

               setMonthlyBudget(Number(newBudget));
               setNewBudget("");

               setShowToast(true);
               setToastMessage("Monthly budget updated successfully!");
               setToastMessageType("success");
          } catch (error) {
               console.error("Error updating budget:", error);
               setShowToast(true);
               setToastMessage("Error updating budget!");
               setToastMessageType("error");
               return;
          }

          setMonthlyBudget(Number(newBudget));

          setNewBudget("");

          setShowToast(true);
          setToastMessage("Monthly budget updated successfully!");
          setToastMessageType("success");
     };

     return (
          <div className="budget-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               {/* Header */}
               <div className="budget-header">
                    <div>
                         <span className="profile-eyebrow">BUDGET PLANNING</span>
                         <h1>Budget</h1>
                         <p>Set your monthly budget and track your spending limits.</p>
                    </div>

                    <button>
                         {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                    </button>
               </div>

               {/* Budget Summary Cards */}
               <div className="budget-stats-grid">
                    <div className="budget-card">
                         <div className="budget-icon blue">
                              <i className="fa-solid fa-wallet"></i>
                         </div>

                         <div>
                              <h5>Monthly Budget</h5>
                              <h3>₹ {Number(monthlyBudget).toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="budget-card">
                         <div className="budget-icon orange">
                              <i className="fa-solid fa-arrow-trend-up"></i>
                         </div>

                         <div>
                              <h5>Spent This Month</h5>
                              <h3>₹ {monthlySpent.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="budget-card">
                         <div className={`budget-icon ${remainingBudget >= 0 ? "greenbg" : "redbg"}`}>
                              <i className="fa-solid fa-piggy-bank"></i>
                         </div>

                         <div>
                              <h5>Remaining Budget</h5>
                              <h3>₹ {remainingBudget.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="budget-card">
                         <div className="budget-icon purple">
                              <i className="fa-solid fa-chart-pie"></i>
                         </div>

                         <div>
                              <h5>Top Spending</h5>
                              <h3>{highestCategory[0]}</h3>
                         </div>
                    </div>
               </div>

               {/* Main Budget Grid */}
               <div className="budget-main-grid">

                    {/* Budget Progress */}
                    <div className="budget-glass-card">
                         <div className="budget-card-title">
                              <h3>Budget Usage</h3>
                              <button>{budgetUsedPercent.toFixed(0)}% Used</button>
                         </div>

                         <div className="budget-progress-area">
                              <div className="budget-circle">
                                   <div
                                        className="budget-circle-fill"
                                        style={{
                                             background: `conic-gradient(
                                                  ${remainingBudget >= 0 ? "#0ea5e9" : "#ef4444"} ${budgetUsedPercent}%,
                                                  #e5e7eb ${budgetUsedPercent}%
                                             )`
                                        }}
                                   >
                                        <div className="budget-circle-inner">
                                             <h2>{budgetUsedPercent.toFixed(0)}%</h2>
                                             <p>Used</p>
                                        </div>
                                   </div>
                              </div>

                              <div className="budget-info-list">
                                   <div className="budget-info-item">
                                        <span>Total Budget</span>
                                        <strong>₹ {monthlyBudget.toLocaleString("en-IN")}</strong>
                                   </div>

                                   <div className="budget-info-item">
                                        <span>Total Spent</span>
                                        <strong>₹ {monthlySpent.toLocaleString("en-IN")}</strong>
                                   </div>

                                   <div className="budget-info-item">
                                        <span>Remaining</span>
                                        <strong className={remainingBudget >= 0 ? "positive" : "negative"}>
                                             ₹ {remainingBudget.toLocaleString("en-IN")}
                                        </strong>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Set Budget Form */}
                    <div className="budget-form-card">
                         <div className="budget-card-title">
                              <h3>Set Monthly Budget</h3>
                              <button>Update</button>
                         </div>

                         <form onSubmit={handleBudgetUpdate}>
                              <div className="form-group">
                                   <label>Budget Amount</label>

                                   <input
                                        type="number"
                                        placeholder="Enter monthly budget"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        required
                                   />
                              </div>

                              <button className="save-budget-btn">
                                   Save Budget
                                   <i className="fa-solid fa-check"></i>
                              </button>
                         </form>

                         <div className="budget-alert-box">
                              {remainingBudget < 0 ? (
                                   <>
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <p>
                                             You have exceeded your monthly budget by{" "}
                                             <strong>
                                                  ₹ {Math.abs(remainingBudget).toLocaleString("en-IN")}
                                             </strong>.
                                        </p>
                                   </>
                              ) : budgetUsedPercent >= 80 ? (
                                   <>
                                        <i className="fa-solid fa-circle-info"></i>
                                        <p>
                                             You have used{" "}
                                             <strong>{budgetUsedPercent.toFixed(0)}%</strong> of your budget.
                                             Spend carefully.
                                        </p>
                                   </>
                              ) : (
                                   <>
                                        <i className="fa-solid fa-circle-check"></i>
                                        <p>
                                             Your budget is under control. You still have{" "}
                                             <strong>₹ {remainingBudget.toLocaleString("en-IN")}</strong> left.
                                        </p>
                                   </>
                              )}
                         </div>
                    </div>
               </div>

               {/* Category Budget Usage */}
               <div className="budget-glass-card">
                    <div className="budget-card-title">
                         <h3>Category Wise Spending</h3>
                         <button>This Month</button>
                    </div>

                    <div className="category-budget-list">
                         {categories.map((cat) => {
                              const amount = categoryTotals[cat] || 0;
                              const percent = monthlySpent > 0 ? (amount / monthlySpent) * 100 : 0;

                              return (
                                   <div className="category-budget-item" key={cat}>
                                        <div className="category-budget-top">
                                             <div>
                                                  <span
                                                       className="category-dot"
                                                       style={{
                                                            backgroundColor: categoryColors[cat] || categoryColors.Other
                                                       }}
                                                  ></span>
                                                  <strong>{cat}</strong>
                                             </div>

                                             <p>₹ {amount.toLocaleString("en-IN")}</p>
                                        </div>

                                        <div className="category-progress">
                                             <div
                                                  className="category-progress-fill"
                                                  style={{
                                                       width: `${percent}%`,
                                                       backgroundColor: categoryColors[cat] || categoryColors.Other
                                                  }}
                                             ></div>
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               </div>
          </div>
     );
}