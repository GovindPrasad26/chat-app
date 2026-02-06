import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Correct hook

const ForgotPassword = () => {
  const navigate = useNavigate(); // ✅ Correct initialization
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);

      // ✅ Redirect to sign-in page after 2 seconds
     
        navigate("/signup"); // Change "/login" to your actual login route
    

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleForgotPassword} style={styles.form}>
        <h2 style={styles.title}>Forgot Password</h2>

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Reset Password
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    marginTop: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  success: {
    marginTop: "15px",
    color: "green",
    fontSize: "14px",
  },
  error: {
    marginTop: "15px",
    color: "red",
    fontSize: "14px",
  },
};

export default ForgotPassword;
