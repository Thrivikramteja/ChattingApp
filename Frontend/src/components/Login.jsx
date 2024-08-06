  import { useState } from "react";
  import { useNavigate } from "react-router-dom";

  import Classes from "./login.module.css";
  import LoginModal from "./LoginModal";

  function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

    const handleSumbit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 401) {
          console.log("Incorrect credentials!");
          navigate("/login");
          setShowWarning(true);
        } else {
          console.log(response);
          navigate("/chats");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
      <LoginModal>
        <form className={Classes.form} onSubmit={handleSumbit}>
          <h1>Login</h1>

          {showWarning && (
            <p className={Classes.wrngCrd}>Incorrect email or password</p>
          )}

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
            name="password"
            id="password"
            onChange={handleChange}
            required
            minLength={6}
          />

          <button type="submit">Login</button>
        </form>
      </LoginModal>
    );
  }

  export default Login;
