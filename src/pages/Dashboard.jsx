// rrd imports
import { Link, useLoaderData } from "react-router-dom";

import React, { useState, useEffect } from "react";
// import BudgetItem from "./BudgetItem";

import axios from "axios";

// library imports
import { toast } from "react-toastify";

// components
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

//  helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";

// loader
export function dashboardLoader() {
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  return { budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // // new user submission
  // if (_action === "newUser") {
  //   try {
  //     localStorage.setItem("userName", JSON.stringify(values.userName));
  //     return toast.success(`Welcome, ${values.userName}`);
  //   } catch (e) {
  //     throw new Error("There was a problem creating your account.");
  //   }
  // }

  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      return toast.success("Budget created!");
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const Dashboard = () => {
  const username = localStorage.getItem("username");
  const [expenses, setExpense] = useState([]);

  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(
          `https://be-cash-flow-keeper.vercel.app/expense/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(" fetch Expense:", response.data.data.expenseLists);
        setExpense(response.data.data.expenseLists);
      } catch (error) {
        console.error("Error fetching Expense:", error);
      }
    };

    fetchExpense();
  }, []);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(
          "https://be-cash-flow-keeper.vercel.app/budget/list/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBudgets(response.data.data.budgetLists);
        console.log(" fetch budgets:", response.data.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <>
      <div className="dashboard">
        <h1>
          Welcome, <span className="accent">{username}</span>
        </h1>
        <div className="grid-sm">
          {budgets && budgets.length > 0 ? (
            <div className="grid-lg">
              <div className="flex-lg">
                <AddBudgetForm />
                <AddExpenseForm budgets={budgets} />
              </div>
              <h2>Existing Budgets</h2>
              <div className="budgets">
                {budgets.map((budget) => (
                  <BudgetItem key={budget.id} budget={budget} />
                ))}
              </div>
              {expenses && expenses.length > 0 && (
                <div className="grid-md">
                  <h2>Recent Expenses</h2>
                  <Table
                    budgets={budgets}
                    expenses={expenses
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .slice(0, 8)}
                  />
                  {expenses.length > 8 && (
                    <Link to="expenses" className="btn btn--dark">
                      View all expenses
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid-sm">
              <p>Create a budget to start tracking your expenses!</p>
              <AddBudgetForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Dashboard;
