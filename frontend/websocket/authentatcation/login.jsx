// import React, { useState } from "react";
// import { Link ,useNavigate} from "react-router-dom";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
// const navigate = useNavigate(); 
// //   const handleLogin = (e) => {
// //     e.preventDefault();
// //     console.log("Email:", email);
// //     console.log("Password:", password);
// //   };
// const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       alert("✅ " + data.message);
//       console.log("User:", data.user);
//       // Example: store user data or redirect
//       localStorage.setItem("user", JSON.stringify(response.token));
//     } else {
//       alert("❌ " + data.message);
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     alert("Something went wrong. Please try again later.");
//   }
// };

  

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <h2 style={styles.title}>Login</h2>

//         <label style={styles.label}>Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           required
//           style={styles.input}
//         />

//         <label style={styles.label}>Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Enter your password"
//           required
//           style={styles.input}
//         />

//         <button type="submit" style={styles.button}>Sign In</button>
// <Link to='/forgot'>
//         <p style={styles.forgot} >
//           Forgot Password?
//         </p>
// </Link>
//       <Link to="/signin">
//         <p style={styles.linkText}>Don't have an account? Sign Up</p>
//       </Link>
//       </form>

//       {/* Sign Up link outside the form */}
//     </div>
//   );
// };

// const styles = {
//   container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" },
//   form: { backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", width: "300px", textAlign: "center" },
//   title: { marginBottom: "20px" },
//   label: { display: "block", textAlign: "left", marginBottom: "5px", marginTop: "15px" },
//   input: { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" },
//   button: { marginTop: "20px", padding: "10px", width: "100%", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer", fontSize: "16px" },
//   forgot: { marginTop: "15px", color: "#007bff", cursor: "pointer", fontSize: "14px", textDecoration: "underline" },
//   linkText: { marginTop: "15px", color: "#007bff", cursor: "pointer", textAlign: "center" },
// };

// export default LoginForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Matches your chat component's redirect
      navigate("/home"); 
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon">
            <FaUserShield size={30} color="#4F46E5" />
          </div>
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="field-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-options">
            <Link to="/forgot" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="signup-footer">
            Don't have an account? <Link to="/signin">Sign Up</Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .login-viewport {
          height: 100vh;
          width: 100vw;
          /* Matches the background of your Chatscreen */
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .login-card {
          background: #ffffff;
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .brand-icon {
          width: 60px;
          height: 60px;
          background: #f5f3ff;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }

        .login-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .login-header p {
          color: #6b7280;
          font-size: 14px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 15px;
          color: #9ca3af;
          font-size: 16px;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
          outline: none;
        }

        .input-wrapper input:focus {
          border-color: #4F46E5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .form-options {
          text-align: right;
          margin-bottom: 25px;
        }

        .forgot-link {
          font-size: 13px;
          color: #4F46E5;
          text-decoration: none;
          font-weight: 500;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: #4F46E5;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-button:hover {
          background: #4338ca;
        }

        .login-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .signup-footer {
          text-align: center;
          margin-top: 25px;
          font-size: 14px;
          color: #6b7280;
        }

        .signup-footer a {
          color: #4F46E5;
          text-decoration: none;
          font-weight: 600;
        }

        /* Responsive Settings */
        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
            box-shadow: none;
            background: transparent;
          }
          .login-viewport {
            background: #ffffff;
          }
          .login-button {
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;