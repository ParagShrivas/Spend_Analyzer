import React, { createContext, useContext, useEffect, useState } from "react";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
     const [expenses, setExpenses] = useState([]);
     const [expenseLoading, setExpenseLoading] = useState(false);

     const fetchExpenses = async () => {
          setExpenseLoading(true);

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
                    console.log(data.message || "Error fetching expenses");
               }
          } catch (error) {
               console.error("Error fetching expenses:", error);
          } finally {
               setExpenseLoading(false);
          }
     };

     useEffect(() => {
          fetchExpenses();
     }, []);

     return (
          <ExpenseContext.Provider
               value={{
                    expenses,
                    setExpenses,
                    expenseLoading,
                    fetchExpenses
               }}
          >
               {children}
          </ExpenseContext.Provider>
     );
};

export const useExpenses = () => {
     return useContext(ExpenseContext);
};