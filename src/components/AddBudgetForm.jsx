import React, { useState, useRef } from "react"; // Import useState along with useRef
import axios from "axios";

// library imports
import { BanknotesIcon } from "@heroicons/react/24/solid";

// colors
const generateRandomColor = () => {
  const randomHue = Math.floor(Math.random() * 360);
  const saturation = "65%";
  const lightness = "50%";
  const randomColor = `hsl(${randomHue}, ${saturation}, ${lightness})`;

  console.log("Random Color:", randomColor);

  return randomColor;
};

const AddBudgetForm = () => {
  const itemColor = generateRandomColor();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      console.log(name, amount);
      const response = await axios.post(
        "https://be-cash-flow-keeper.vercel.app/budget",
        {
          name,
          amount: parseFloat(amount),
          color: itemColor,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("New budget created:", response.data);
      setName("");
      setAmount("");
    } catch (error) {
      console.error("Error creating new budget:", error);
      alert("Can't create budget. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusRef = useRef(null);

  return (
    <div className="form-wrapper">
      <h2 className="h3">Create budget</h2>
      <form onSubmit={handleSubmit} className="grid-sm">
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="name"
            id="newBudget"
            placeholder="Example: Groceries"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="text"
            inputMode="numeric"
            step="1000"
            name="amount"
            id="newBudgetAmount"
            placeholder="Rp. Example 35000"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <input type="hidden" name="_action" value="createBudget" />
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Create budget</span>
              <BanknotesIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
export default AddBudgetForm;
