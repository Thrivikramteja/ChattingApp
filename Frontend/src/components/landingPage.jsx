import { Link } from "react-router-dom";

import Classes from "./landingPage.module.css";

function LandingPage() {
  return (
    <>
      <div className={Classes.body}>
        <p className={Classes.body}>Welcome to FleetingTalk!</p>
        <p className={Classes.body}>
          Where conversations are as temporary as they are meaningful.
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
