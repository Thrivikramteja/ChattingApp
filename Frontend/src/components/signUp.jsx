import Classes from "./signUp.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignUpModal from "./SignUpModal";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showWarning, setShowWarning] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 400) {
        navigate("/signup");
        setShowWarning(true);
        setAlreadyExists(false);
      } else if (response.status === 409) {
        navigate("/signup");
        setAlreadyExists(true);
        setShowWarning(false);
      } else if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function redirectToLoginPage() {
    navigate("/login");
  }

  return (
    <SignUpModal>
      <form className={Classes.form} onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        {showWarning && <p className={Classes.wrngCrd}>Incorrect Data!</p>}

        {alreadyExists && (
          <p className={Classes.wrngCrd}>User Already Exists!</p>
        )}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required
          minLength={6}
        />
        <button type="submit">Create User</button>
        <button onClick={redirectToLoginPage}>Login instead</button>
      </form>
    </SignUpModal>
  );
}

export default SignUp;
