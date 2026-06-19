import React, { useState } from "react";
import "../css/reports.css";
import Toast from "../components/toast";
import { useExpenses } from "../context/ExpenseContext";

export default function Reports() {
     const { expenses } = useExpenses();

     const [reportType, setReportType] = useState("lifetime");
     const [selectedCategory, setSelectedCategory] = useState("All Categories");

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

     const currentMonth = new Date().getMonth();
     const currentYear = new Date().getFullYear();

     const filteredByReportType = expenses.filter((expense) => {
          const expenseDate = new Date(expense.expense_date || expense.created_at);

          if (reportType === "monthly") {
               return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
               );
          }

          if (reportType === "yearly") {
               return expenseDate.getFullYear() === currentYear;
          }

          return true;
     });

     const filteredReports = filteredByReportType.filter((expense) => {
          if (selectedCategory === "All Categories") return true;

          return expense.category === selectedCategory;
     });

     const totalAmount = filteredReports.reduce(
          (total, expense) => total + Number(expense.amount || 0),
          0
     );

     const highestExpense = filteredReports.length > 0
          ? Math.max(...filteredReports.map((expense) => Number(expense.amount || 0)))
          : 0;

     const averageExpense = filteredReports.length > 0
          ? totalAmount / filteredReports.length
          : 0;

     const categoryTotals = filteredReports.reduce((acc, expense) => {
          const category = expense.category || "Other";
          const amount = Number(expense.amount || 0);

          acc[category] = (acc[category] || 0) + amount;

          return acc;
     }, {});

     const topCategory = Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
     )[0] || ["No Data", 0];

     const exportCSV = () => {
          if (filteredReports.length === 0) {
               setShowToast(true);
               setToastMessage("No report data available to export!");
               setToastMessageType("error");
               return;
          }

          const headers = [
               "Title",
               "Category",
               "Amount",
               "Date",
               "Description"
          ];

          const rows = filteredReports.map((expense) => [
               expense.title || "",
               expense.category || "",
               expense.amount || 0,
               new Date(expense.expense_date || expense.created_at).toLocaleDateString("en-IN"),
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
          link.download = `${reportType}-expense-report.csv`;
          link.click();

          URL.revokeObjectURL(url);

          setShowToast(true);
          setToastMessage("Report exported successfully!");
          setToastMessageType("success");
     };

     const printReport = () => {
          window.print();
     };

     return (
          <div className="reports-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               {/* Header */}
               <div className="reports-header">
                    <div>
                         <h1>Reports</h1>
                         <p>Generate, filter, print, and export your expense reports.</p>
                    </div>

                    <div className="reports-header-actions">
                         <button onClick={printReport}>
                              <i className="fa-solid fa-print"></i>
                              Print
                         </button>

                         <button onClick={exportCSV}>
                              <i className="fa-solid fa-file-csv"></i>
                              Export CSV
                         </button>
                    </div>
               </div>

               {/* Report Filters */}
               <div className="reports-filter-card">
                    <div className="filter-group">
                         <label>Report Type</label>

                         <select
                              value={reportType}
                              onChange={(e) => setReportType(e.target.value)}
                         >
                              <option value="lifetime">Lifetime Report</option>
                              <option value="yearly">This Year Report</option>
                              <option value="monthly">This Month Report</option>
                         </select>
                    </div>

                    <div className="filter-group">
                         <label>Category</label>

                         <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                         >
                              <option value="All Categories">All Categories</option>

                              {categories.map((cat) => (
                                   <option key={cat} value={cat}>
                                        {cat}
                                   </option>
                              ))}
                         </select>
                    </div>
               </div>

               {/* Report Summary Cards */}
               <div className="reports-stats-grid">
                    <div className="reports-card">
                         <div className="reports-icon blue">
                              <i className="fa-solid fa-wallet"></i>
                         </div>

                         <div>
                              <h5>Total Amount</h5>
                              <h3>₹ {totalAmount.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="reports-card">
                         <div className="reports-icon orange">
                              <i className="fa-solid fa-receipt"></i>
                         </div>

                         <div>
                              <h5>Total Records</h5>
                              <h3>{filteredReports.length}</h3>
                         </div>
                    </div>

                    <div className="reports-card">
                         <div className="reports-icon purple">
                              <i className="fa-solid fa-ranking-star"></i>
                         </div>

                         <div>
                              <h5>Top Category</h5>
                              <h3>{topCategory[0]}</h3>
                         </div>
                    </div>

                    <div className="reports-card">
                         <div className="reports-icon greenbg">
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

               {/* Report Table */}
               <div className="reports-table-card">
                    <div className="reports-table-title">
                         <div>
                              <h3>
                                   {reportType === "lifetime"
                                        ? "Lifetime Report"
                                        : reportType === "yearly"
                                             ? "This Year Report"
                                             : "This Month Report"}
                              </h3>

                              <p>
                                   Showing {filteredReports.length} records
                              </p>
                         </div>

                         <span>
                              ₹ {totalAmount.toLocaleString("en-IN")}
                         </span>
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
                                        <th>Description</th>
                                   </tr>
                              </thead>

                              <tbody>
                                   {filteredReports.length > 0 ? (
                                        filteredReports.map((expense, index) => (
                                             <tr key={expense.expense_id || expense.id || index}>
                                                  <td>{index + 1}</td>
                                                  <td>{expense.title}</td>
                                                  <td>{expense.category}</td>
                                                  <td className="amount">
                                                       ₹ {Number(expense.amount || 0).toLocaleString("en-IN")}
                                                  </td>
                                                  <td>
                                                       {new Date(expense.expense_date || expense.created_at)
                                                            .toLocaleDateString("en-IN")}
                                                  </td>
                                                  <td>{expense.description || "-"}</td>
                                             </tr>
                                        ))
                                   ) : (
                                        <tr>
                                             <td colSpan="6" style={{ textAlign: "center" }}>
                                                  No report data found.
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>
          </div>
     );
}