import React, { useEffect, useState } from "react";
import "../css/analytics.css";
import Toast from "../components/toast";

import {
     Chart as ChartJS,
     ArcElement,
     BarElement,
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Tooltip,
     Legend
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
     ArcElement,
     BarElement,
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Tooltip,
     Legend
);

export default function Analytics() {
     const [expenses, setExpenses] = useState([]);

     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");

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

     // fetch all expenses of the user from backend
     const fetchExpenses = async () => {
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
                    setToastMessage(data.message || "Error fetching analytics data!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error fetching analytics:", error);

               setShowToast(true);
               setToastMessage("Backend server not reachable!");
               setToastMessageType("error");
          }
     };

     useEffect(() => {
          fetchExpenses();
     }, []);


     // Basic Calculations

     const totalExpense = expenses.reduce(
          (total, expense) => total + Number(expense.amount || 0),
          0
     );

     const totalTransactions = expenses.length;

     const averageExpense =
          totalTransactions > 0 ? totalExpense / totalTransactions : 0;


     // Category Wise Total

     const categoryTotals = expenses.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     const sortedCategoryTotals = Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
     );

     const highestCategory =
          sortedCategoryTotals.length > 0 ? sortedCategoryTotals[0] : ["-", 0];

     const lowestCategory =
          sortedCategoryTotals.length > 0
               ? sortedCategoryTotals[sortedCategoryTotals.length - 1]
               : ["-", 0];


     // Monthly Trend Data - Last 6 Months

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

     const monthlyTrendData = {
          labels: lastSixMonths.map((item) => item.month),
          datasets: [
               {
                    label: "Monthly Expense",
                    data: lastSixMonths.map((item) => item.total),
                    borderColor: "#0ea5e9",
                    backgroundColor: "rgba(14, 165, 233, 0.12)",
                    tension: 0.4,
                    fill: true
               }
          ]
     };

     const categoryBarData = {
          labels: Object.keys(categoryTotals),
          datasets: [
               {
                    label: "Category Expense",
                    data: Object.values(categoryTotals),
                    backgroundColor: Object.keys(categoryTotals).map(
                         (category) => categoryColors[category] || categoryColors.Other
                    ),
                    borderRadius: 10
               }
          ]
     };

     const categoryDoughnutData = {
          labels: Object.keys(categoryTotals),
          datasets: [
               {
                    data: Object.values(categoryTotals),
                    backgroundColor: Object.keys(categoryTotals).map(
                         (category) => categoryColors[category] || categoryColors.Other
                    ),
                    borderWidth: 2,
                    borderColor: "#ffffff"
               }
          ]
     };

     const chartOptions = {
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
          }
     };

     const doughnutOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
               legend: {
                    position: "bottom"
               },
               tooltip: {
                    callbacks: {
                         label: function (context) {
                              const value = context.raw;
                              const percentage =
                                   totalExpense > 0
                                        ? ((value / totalExpense) * 100).toFixed(1)
                                        : 0;

                              return `${context.label}: ₹ ${Number(value).toLocaleString("en-IN")} (${percentage}%)`;
                         }
                    }
               }
          }
     };

     // export CSV report of all expenses
     const [downloading, setDownloading] = useState(false);

     const exportCSV = () => {
          if (expenses.length === 0) {
               setShowToast(true);
               setToastMessage("No expenses available to export!");
               setToastMessageType("error");
               return;
          }

          setDownloading(true);

          const headers = [
               "Title",
               "Category",
               "Amount",
               "Date",
               "Description"
          ];

          const rows = expenses.map((expense) => [
               expense.title || "",
               expense.category || "",
               expense.amount || 0,
               new Date(expense.expense_date).toLocaleDateString("en-IN"),
               expense.description || ""
          ]);

          const csvContent = [
               headers.join(","),
               ...rows.map((row) =>
                    row
                         .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                         .join(",")
               )
          ].join("\n");

          const blob = new Blob([csvContent], {
               type: "text/csv;charset=utf-8;"
          });

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "lifetime-expense-report.csv";
          link.click();

          URL.revokeObjectURL(url);

          setDownloading(false);

          setShowToast(true);
          setToastMessage("CSV report exported successfully!");
          setToastMessageType("success");
     };

     return (
          <div className="analytics-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               {/* Header */}
               <div className="analytics-header">
                    <div>
                         <h1>Analytics</h1>
                         <p>Understand your spending patterns and financial behavior.</p>
                    </div>

                    <button onClick={exportCSV} disabled={downloading}>
                         {downloading ? (
                              <>
                                   Downloading...
                                   {" "}
                                   <i className="fa-solid fa-spinner fa-spin"></i>
                              </>
                         ) : (
                              <>
                                   Download Report
                                   {" "}
                                   <i className="fa-solid fa-download"></i>
                              </>
                         )}
                    </button>
               </div>

               {/* Insight Cards */}
               <div className="analytics-stats-grid">
                    <div className="analytics-card">
                         <div className="analytics-icon blue">
                              <i className="fa-solid fa-wallet"></i>
                         </div>

                         <div>
                              <h5>Total Expense</h5>
                              <h3>₹ {totalExpense.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="analytics-card">
                         <div className="analytics-icon orange">
                              <i className="fa-solid fa-receipt"></i>
                         </div>

                         <div>
                              <h5>Total Transactions</h5>
                              <h3>{totalTransactions}</h3>
                         </div>
                    </div>

                    <div className="analytics-card">
                         <div className="analytics-icon purple">
                              <i className="fa-solid fa-arrow-trend-up"></i>
                         </div>

                         <div>
                              <h5>Highest Category</h5>
                              <h3>{highestCategory[0]}</h3>
                         </div>
                    </div>

                    <div className="analytics-card">
                         <div className="analytics-icon greenbg">
                              <i className="fa-solid fa-chart-simple"></i>
                         </div>

                         <div>
                              <h5>Average Expense</h5>
                              <h3>
                                   ₹ {averageExpense.toLocaleString("en-IN", {
                                        maximumFractionDigits: 0
                                   })}
                              </h3>
                         </div>
                    </div>
               </div>

               {/* Main Charts */}
               <div className="analytics-chart-grid">
                    <div className="analytics-glass-card">
                         <div className="analytics-card-title">
                              <h3>Monthly Spending Trend</h3>
                              <button>Last 6 Months</button>
                         </div>

                         <div className="analytics-chart-box">
                              <Line data={monthlyTrendData} options={chartOptions} />
                         </div>
                    </div>

                    <div className="analytics-glass-card">
                         <div className="analytics-card-title">
                              <h3>Category Wise Expense</h3>
                              <button>Lifetime</button>
                         </div>

                         <div className="analytics-chart-box">
                              {Object.keys(categoryTotals).length > 0 ? (
                                   <Bar data={categoryBarData} options={chartOptions} />
                              ) : (
                                   <div className="empty-analytics-chart">No data found</div>
                              )}
                         </div>
                    </div>
               </div>

               {/* Bottom Section */}
               <div className="analytics-bottom-grid">
                    <div className="analytics-glass-card">
                         <div className="analytics-card-title">
                              <h3>Expense Distribution</h3>
                              <button>All Categories</button>
                         </div>

                         <div className="analytics-doughnut-box">
                              {Object.keys(categoryTotals).length > 0 ? (
                                   <Doughnut
                                        data={categoryDoughnutData}
                                        options={doughnutOptions}
                                   />
                              ) : (
                                   <div className="empty-analytics-chart">No data found</div>
                              )}
                         </div>
                    </div>

                    <div className="analytics-glass-card">
                         <div className="analytics-card-title">
                              <h3>Spending Insights</h3>
                              {/* <button>Auto</button> */}
                         </div>

                         <div className="insights-list">
                              <div className="insight-item">
                                   <i className="fa-solid fa-circle-info"></i>
                                   <p>
                                        Your highest spending category is{" "}
                                        <strong>{highestCategory[0]}</strong> with ₹{" "}
                                        {Number(highestCategory[1]).toLocaleString("en-IN")}.
                                   </p>
                              </div>

                              <div className="insight-item">
                                   <i className="fa-solid fa-arrow-down"></i>
                                   <p>
                                        Your lowest spending category is{" "}
                                        <strong>{lowestCategory[0]}</strong> with ₹{" "}
                                        {Number(lowestCategory[1]).toLocaleString("en-IN")}.
                                   </p>
                              </div>

                              <div className="insight-item">
                                   <i className="fa-solid fa-chart-line"></i>
                                   <p>
                                        Your average transaction amount is ₹{" "}
                                        {averageExpense.toLocaleString("en-IN", {
                                             maximumFractionDigits: 0
                                        })}.
                                   </p>
                              </div>

                              <div className="insight-item">
                                   <i className="fa-solid fa-lightbulb"></i>
                                   <p>
                                        You have recorded{" "}
                                        <strong>{totalTransactions}</strong> total transactions so far.
                                   </p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}