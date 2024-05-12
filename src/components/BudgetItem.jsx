// rrd imports
import { Form, Link } from "react-router-dom";

// library imports
import { CircleStackIcon, TrashIcon } from "@heroicons/react/24/outline";

// helper functions
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { name, amount, spent, color } = budget;
  const remaining = amount - spent;

  return (
    <div
      className="budget"
      style={{
        border: `2px solid ${color}`,
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <div className="flex-xs"></div>
      <div
        className="progress-text"
        style={{
          color: `black`,
        }}
      >
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text">
        <small
          style={{
            color: `black`,
          }}
        >
          {formatCurrency(spent)} spent
        </small>
        <small>{formatCurrency(remaining)} remaining</small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Are you sure you want to permanently delete this budget?"
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="btn"
              style={{
                border: `2px solid ${color}`,
                padding: "10px",
                marginBottom: "20px",
                backgroundColor: `${color}`,
              }}
            >
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        </div>
      ) : (
        <>
          <div className="flex-sm">
            {/* <Link
            to={`/budget/${id}`}
            className="btn"
            style={{
              border: `2px solid ${color}`,
              // padding: "10px",
              // marginBottom: "20px",
              backgroundColor: `${color}`,
            }}
          >
            <span>View Details</span>
            <CircleStackIcon width={20} />
          </Link> */}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetItem;
