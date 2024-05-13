// component import
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

const Table = ({ budgets, expenses, showBudget = true }) => {
  const formatDateToLocaleString = (epoch) =>
    new Date(epoch).toLocaleDateString();

  const formatCurrency = (amt) => {
    return amt.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState({
    id: null,
    name: "",
    amount: 0,
  });

  const handleDeleteExpense = async (expenseId) => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `https://be-cash-flow-keeper.vercel.app/expense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (expense) => {
    setIsEditing(true);
    setEditedExpense({ ...expense });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedExpense({ id: null, name: "", amount: 0 });
  };

  const handleSaveEdit = async () => {
    try {
      setIsEditing(true);
      await axios.put(
        `https://be-cash-flow-keeper.vercel.app/expense/${editedExpense.id}`,
        {
          name: editedExpense.name,
          amount: editedExpense.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error editing expense:", error);
      setIsEditing(false);
    }
  };

  console.log("expenses table", expenses);
  console.log("budgets table", budgets);

  return (
    <div className="table">
      {isDeleting && <div className="loading-indicator">Loading...</div>}
      <table>
        <thead>
          <tr>
            {["Name", "Amount", "Date", showBudget ? "Budget" : "", ""].map(
              (i, index) => (
                <th key={index}>{i}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const matchingBudget = budgets.find(
              (budget) => budget.id === expense.id_budget
            );
            return (
              <tr key={expense.id}>
                {isEditing && editedExpense.id === expense.id ? (
                  <td>
                    <input
                      type="text"
                      value={editedExpense.name}
                      onChange={(e) =>
                        setEditedExpense({
                          ...editedExpense,
                          name: e.target.value,
                        })
                      }
                      style={{ width: "200px", padding: 0 }}
                    />
                  </td>
                ) : (
                  <td>{expense.name}</td>
                )}
                <td>
                  {isEditing && editedExpense.id === expense.id ? (
                    <p>{formatCurrency(expense.amount)}</p>
                  ) : (
                    <p>{formatCurrency(expense.amount)}</p>
                  )}
                </td>
                <td>{formatDateToLocaleString(expense.created_at)}</td>
                {matchingBudget && (
                  <td>
                    <Link
                      // to={`/budget/${matchingBudget.id}`}
                      to={`/dashboard`}
                      style={{ backgroundColor: matchingBudget.color }}
                    >
                      {matchingBudget.name}
                    </Link>
                  </td>
                )}
                {isEditing && editedExpense.id === expense.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn--success"
                    >
                      <CheckIcon width={20} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn--warning"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditClick(expense)}
                    className="btn btn--warning"
                  >
                    <PencilIcon width={20} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="btn btn--warning"
                  aria-label={`Delete ${expense.name} expense`}
                  disabled={isDeleting}
                >
                  <TrashIcon width={20} />
                </button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
