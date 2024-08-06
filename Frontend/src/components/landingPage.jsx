import { Link } from "react-router-dom";

import Classes from "./landingPage.module.css";

function LandingPage() {
  return (
    <>
      <div className={Classes.body}>
        <p className={Classes.body}>Welcome to ChatApp!</p>
        <p className={Classes.body}>
          Chat with your friends and family members!
        </p>
      </div>

      <div className={Classes.main}>
        <div>
          <p>Click here to Sign Up</p>
          <Link to="/signup" className={Classes.button}>
            Sign Up
          </Link>
        </div>
        <div>
          <p>Already have an account?</p>
          <Link to="/login" className={Classes.button}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
