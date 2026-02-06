import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from "react-icons/fa";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        firstName,
        email,
        password,
        phone,
      });

      alert("Registration Successful! Redirecting to login...");
      
      // ✅ Automatically navigate to the Login page
      navigate("/"); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      alert("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon">
            <FaUserPlus size={28} color="#4F46E5" />
          </div>
          <h2>Create Account</h2>
          <p>Join our community today</p>
        </div>

        <form onSubmit={handleSignUp} className="auth-form">
          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <FaUser className="field-icon" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <FaPhone className="field-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 890"
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

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .auth-viewport {
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .auth-card {
          background: #ffffff;
          width: 100%;
          max-width: 450px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .brand-icon {
          width: 55px;
          height: 55px;
          background: #f5f3ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }

        .auth-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 5px;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 14px;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #9ca3af;
          font-size: 15px;
        }

        .input-wrapper input {
          width: 100%;
          padding: 11px 15px 11px 42px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: 0.2s;
          outline: none;
        }

        .input-wrapper input:focus {
          border-color: #4F46E5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .submit-button {
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
          margin-top: 10px;
        }

        .submit-button:hover {
          background: #4338ca;
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #6b7280;
        }

        .auth-footer a {
          color: #4F46E5;
          text-decoration: none;
          font-weight: 600;
        }

        /* Responsive Settings */
        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
            box-shadow: none;
            background: transparent;
          }
          .auth-viewport {
            background: #ffffff;
          }
          .auth-header h2 { font-size: 22px; }
        }
      `}</style>
    </div>
  );
};

export default SignUpForm;