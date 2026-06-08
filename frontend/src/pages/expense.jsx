import React, { useEffect, useState } from "react";
import "../css/expense.css";
import {useExpenses} from '../context/ExpenseContext';
import Toast from "../components/toast";

export default function Expense() {
     
     // Expense Data
     
     const { expenses, setExpenses, fetchExpenses, expenseLoading } = useExpenses();

     
     // Form States
     // Used for both Add and Edit
     
     const [title, setTitle] = useState("");
     const [amount, setAmount] = useState("");
     const [category, setCategory] = useState("");
     const [date, setDate] = useState("");
     const [description, setDescription] = useState("");

     
     // UI States
     
     const [loading, setLoading] = useState(false);
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");

     
     // Add / Edit Overlay States
     
     const [showExpenseOverlay, setShowExpenseOverlay] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const [editExpenseId, setEditExpenseId] = useState(null);

     
     // Delete Overlay States
     
     const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
     const [selectedExpenseId, setSelectedExpenseId] = useState(null);

     
     // Filter / Sort / Pagination States
     
     const [searchText, setSearchText] = useState("");
     const [selectedCategory, setSelectedCategory] = useState("All Categories");
     const [fromDate, setFromDate] = useState("");
     const [toDate, setToDate] = useState("");
     const [sortBy, setSortBy] = useState("latest");
     const [currentPage, setCurrentPage] = useState(1);

     const itemsPerPage = 8;

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

     
     // Indian Date Helper
     // Blocks future dates based on India timezone
     
     const getIndianDate = () => {
          return new Intl.DateTimeFormat("en-CA", {
               timeZone: "Asia/Kolkata",
               year: "numeric",
               month: "2-digit",
               day: "2-digit"
          }).format(new Date());
     };
     
     // Summary Calculations
     
     const totalRecords = expenses.length;

     const currentMonth = new Date().getMonth();
     const currentYear = new Date().getFullYear();

     const monthlyTotalExpense = expenses
          .filter((expense) => {
               const expenseDate = new Date(expense.expense_date || expense.created_at);

               return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
               );
          })
          .reduce((total, expense) => total + Number(expense.amount || 0), 0);

     const highestExpense = expenses.length > 0
          ? Math.max(...expenses.map((expense) => Number(expense.amount || 0)))
          : 0;

     const totalExpense = expenses.reduce(
          (total, expense) => total + Number(expense.amount || 0),
          0
     );

     const averageExpense = expenses.length > 0
          ? totalExpense / expenses.length
          : 0;

     
     // Filter Expenses
     
     const filteredExpenses = expenses.filter((expense) => {
          const expenseTitle = expense.title?.toLowerCase() || "";
          const expenseCategory = expense.category || "";
          const expenseDate = expense.expense_date || expense.created_at;

          const searchMatch = expenseTitle.includes(searchText.toLowerCase());

          const categoryMatch =
               selectedCategory === "All Categories" ||
               expenseCategory === selectedCategory;

          const fromDateMatch =
               !fromDate || new Date(expenseDate) >= new Date(fromDate);

          const toDateMatch =
               !toDate || new Date(expenseDate) <= new Date(toDate);

          return searchMatch && categoryMatch && fromDateMatch && toDateMatch;
     });

     
     // Sort Expenses
     
     const sortedExpenses = [...filteredExpenses].sort((a, b) => {
          if (sortBy === "latest") {
               return new Date(b.expense_date || b.created_at) - new Date(a.expense_date || a.created_at);
          }

          if (sortBy === "oldest") {
               return new Date(a.expense_date || a.created_at) - new Date(b.expense_date || b.created_at);
          }

          if (sortBy === "highest") {
               return Number(b.amount || 0) - Number(a.amount || 0);
          }

          if (sortBy === "lowest") {
               return Number(a.amount || 0) - Number(b.amount || 0);
          }

          if (sortBy === "az") {
               return a.title.localeCompare(b.title);
          }

          if (sortBy === "za") {
               return b.title.localeCompare(a.title);
          }

          return 0;
     });

     
     // Pagination
     
     const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

     const paginatedExpenses = sortedExpenses.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
     );

     
     // Reset Form
     
     const resetForm = () => {
          setTitle("");
          setAmount("");
          setCategory("");
          setDate("");
          setDescription("");
          setIsEditing(false);
          setEditExpenseId(null);
     };

     
     // Open Add Overlay
     
     const openAddOverlay = () => {
          resetForm();
          setShowExpenseOverlay(true);
     };

     
     // Open Edit Overlay With Existing Data
     
     const openEditOverlay = (expense) => {
          setIsEditing(true);
          setEditExpenseId(expense.expense_id || expense.id);

          setTitle(expense.title || "");
          setAmount(expense.amount || "");
          setCategory(expense.category || "");
          setDate(
               expense.expense_date?.split("T")[0] ||
               expense.created_at?.split("T")[0] ||
               ""
          );
          setDescription(expense.description || "");

          setShowExpenseOverlay(true);
     };

     
     // Add / Update Expense
     
     const handleSubmitExpense = async (e) => {
          e.preventDefault();

          setLoading(true);

          const url = isEditing
               ? `http://localhost:1500/expense/update/${editExpenseId}`
               : "http://localhost:1500/expense/add";

          const method = isEditing ? "PUT" : "POST";

          try {
               const response = await fetch(url, {
                    method,
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
                    setToastMessage(
                         isEditing
                              ? "Expense updated successfully!"
                              : "Expense added successfully!"
                    );
                    setToastMessageType("success");

                    setShowExpenseOverlay(false);
                    resetForm();

                    await fetchExpenses();
               } else {
                    setShowToast(true);
                    setToastMessage(data.message || "Something went wrong!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error saving expense:", error);

               setShowToast(true);
               setToastMessage("Error saving expense!");
               setToastMessageType("error");
          } finally {
               setLoading(false);
          }
     };

     
     // Delete Expense
     
     const handleDelete = async () => {
          if (!selectedExpenseId) return;

          setShowDeleteOverlay(false);

          try {
               const response = await fetch(`http://localhost:1500/expense/delete/${selectedExpenseId}`, {
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

                    setSelectedExpenseId(null);

                    await fetchExpenses();
               } else {
                    setShowToast(true);
                    setToastMessage(data.message || "Error deleting expense!");
                    setToastMessageType("error");
               }
          } catch (error) {
               console.error("Error deleting expense:", error);

               setShowToast(true);
               setToastMessage("Error deleting expense!");
               setToastMessageType("error");
          }
     };

     
     // Reset Filters
     
     const resetFilters = () => {
          setSearchText("");
          setSelectedCategory("All Categories");
          setFromDate("");
          setToDate("");
          setSortBy("latest");
          setCurrentPage(1);
     };

     return (
          <div className="expense-page">
               <Toast
                    type={toastMessageType}
                    message={toastMessage}
                    show={showToast}
                    setShow={setShowToast}
               />

               {/* Page Header */}
               <div className="expense-page-header">
                    <div>
                         <h1>Expenses</h1>
                         <p>Manage, filter, edit, and organize all your spending records.</p>
                    </div>

                    <button className="add-expense-open-btn" onClick={openAddOverlay}>
                         <i className="fa-solid fa-plus"></i>
                         Add Expense
                    </button>
               </div>

               {/* Mini Cards */}
               <div className="expense-stats-grid">
                    <div className="expense-mini-card">
                         <div className="mini-icon blue">
                              <i className="fa-solid fa-receipt"></i>
                         </div>
                         <div>
                              <h5>Total Records</h5>
                              <h3>{totalRecords}</h3>
                         </div>
                    </div>

                    <div className="expense-mini-card">
                         <div className="mini-icon orange">
                              <i className="fa-solid fa-calendar-days"></i>
                         </div>
                         <div>
                              <h5>This Month</h5>
                              <h3>₹ {monthlyTotalExpense.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="expense-mini-card">
                         <div className="mini-icon red">
                              <i className="fa-solid fa-arrow-up"></i>
                         </div>
                         <div>
                              <h5>Highest Expense</h5>
                              <h3>₹ {highestExpense.toLocaleString("en-IN")}</h3>
                         </div>
                    </div>

                    <div className="expense-mini-card">
                         <div className="mini-icon green">
                              <i className="fa-solid fa-chart-simple"></i>
                         </div>
                         <div>
                              <h5>Average Expense</h5>
                              <h3>₹ {averageExpense.toLocaleString("en-IN", {
                                   maximumFractionDigits: 0
                              })}</h3>
                         </div>
                    </div>
               </div>

               {/* Filters */}
               <div className="expense-filter-card">
                    <div className="filter-group search-filter">
                         <i className="fa-solid fa-magnifying-glass"></i>
                         <input
                              type="text"
                              placeholder="Search by title..."
                              value={searchText}
                              onChange={(e) => {
                                   setSearchText(e.target.value);
                                   setCurrentPage(1);
                              }}
                         />
                    </div>

                    <div className="filter-group">
                         <select
                              value={selectedCategory}
                              onChange={(e) => {
                                   setSelectedCategory(e.target.value);
                                   setCurrentPage(1);
                              }}
                         >
                              <option value="All Categories">All Categories</option>

                              {categories.map((cat) => (
                                   <option key={cat} value={cat}>
                                        {cat}
                                   </option>
                              ))}
                         </select>
                    </div>

                    <div className="filter-group">
                         <input
                              type="date"
                              value={fromDate}
                              max={getIndianDate()}
                              onChange={(e) => {
                                   setFromDate(e.target.value);
                                   setCurrentPage(1);
                              }}
                         />
                    </div>

                    <div className="filter-group">
                         <input
                              type="date"
                              value={toDate}
                              max={getIndianDate()}
                              onChange={(e) => {
                                   setToDate(e.target.value);
                                   setCurrentPage(1);
                              }}
                         />
                    </div>

                    <div className="filter-group">
                         <select
                              value={sortBy}
                              onChange={(e) => {
                                   setSortBy(e.target.value);
                                   setCurrentPage(1);
                              }}
                         >
                              <option value="latest">Latest First</option>
                              <option value="oldest">Oldest First</option>
                              <option value="highest">Highest Amount</option>
                              <option value="lowest">Lowest Amount</option>
                              <option value="az">Title A-Z</option>
                              <option value="za">Title Z-A</option>
                         </select>
                    </div>

                    <button className="reset-filter-btn" onClick={resetFilters}>
                         Reset
                    </button>
               </div>

               {/* Expenses Table */}
               <div className="expense-table-card">
                    <div className="expense-table-title">
                         <h3>All Expenses</h3>
                         <p>{sortedExpenses.length} records found</p>
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
                                                       ₹ {Number(expense.amount || 0).toLocaleString("en-IN")}
                                                  </td>
                                                  <td>
                                                       {new Date(expense.expense_date || expense.created_at)
                                                            .toLocaleDateString("en-IN")}
                                                  </td>
                                                  <td>{expense.description || "-"}</td>
                                                  <td>
                                                       <button
                                                            className="edit-btn"
                                                            onClick={() => openEditOverlay(expense)}
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
                                             <td colSpan="7" style={{ textAlign: "center" }}>
                                                  No expenses found.
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </table>
                    </div>

                    {/* Pagination */}
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

               {/* Add / Edit Expense Overlay */}
               {showExpenseOverlay && (
                    <div className="expense-overlay">
                         <div className="expense-overlay-box">
                              <div className="overlay-header">
                                   <div>
                                        <h3>{isEditing ? "Edit Expense" : "Add Expense"}</h3>
                                        <p>
                                             {isEditing
                                                  ? "Update your selected expense details."
                                                  : "Add a new expense record."}
                                        </p>
                                   </div>

                                   <button
                                        className="overlay-close-btn"
                                        onClick={() => {
                                             setShowExpenseOverlay(false);
                                             resetForm();
                                        }}
                                   >
                                        <i className="fa-solid fa-xmark"></i>
                                   </button>
                              </div>

                              <form onSubmit={handleSubmitExpense}>
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
                                             max={getIndianDate()}
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

                                   <div className="overlay-actions">
                                        <button
                                             type="button"
                                             className="cancel-btn"
                                             onClick={() => {
                                                  setShowExpenseOverlay(false);
                                                  resetForm();
                                             }}
                                        >
                                             Cancel
                                        </button>

                                        <button
                                             type="submit"
                                             className="save-btn"
                                             disabled={loading}
                                        >
                                             {loading ? (
                                                  <>
                                                       Saving...
                                                       <i className="fa-solid fa-spinner fa-spin"></i>
                                                  </>
                                             ) : (
                                                  <>
                                                       {isEditing ? "Update Expense" : "Add Expense"}
                                                       <i className={`fa-solid ${isEditing ? "fa-pen" : "fa-plus"}`}></i>
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}

               {/* Delete Confirmation Overlay */}
               {showDeleteOverlay && (
                    <div className="delete-overlay">
                         <div className="delete-box">
                              <div className="delete-icon">
                                   <i className="fa-solid fa-trash"></i>
                              </div>

                              <h3>Delete Expense?</h3>

                              <p>Are you sure you want to delete this expense?</p>

                              <div className="delete-actions">
                                   <button className="confirm-delete-btn" onClick={handleDelete}>
                                        Yes
                                   </button>

                                   <button
                                        className="cancel-delete-btn"
                                        onClick={() => {
                                             setShowDeleteOverlay(false);
                                             setSelectedExpenseId(null);
                                        }}
                                   >
                                        No
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}