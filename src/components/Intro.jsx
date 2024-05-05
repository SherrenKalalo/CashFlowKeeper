import { Form } from "react-router-dom";

// library
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import illustration from "../assets/illustration.jpg";

const Intro = () => {
  return (
    <div className="intro">
      <div>
        <h1>Welcome to</h1>
        <h1 className="accent">Cash Flow Keeper</h1>
        <p>
          Your personal or family financial management assistant. Take control
          of your money with ease.
        </p>
        {/* <p>
          Your personal and family financial management assistant. Cash Flow
          Keeper helps you record and manage your personal or family expenses
          with ease.
        </p> */}
        <Form method="post">
          <input
            type="text"
            name="userName"
            required
            placeholder="What is your name?"
            aria-label="Your Name"
            autoComplete="given-name"
          />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark">
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      <img src={illustration} alt="Manage Money" width={600} />
    </div>
  );
};
export default Intro;
