import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, provider } from "../firebaseConfig"; // Firebase configuration
import "./Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false); // Toggle for password reset
  const [registerMode, setRegisterMode] = useState(false); // Toggle for register mode
  const [email, setEmail] = useState(""); // Manage email state
  const [password, setPassword] = useState(""); // Manage password state
  const navigate = useNavigate();
   

  // Redirect to home page if already authenticated (token exists)
  useEffect(() => {
    if (sessionStorage.getItem("jwt_token")) {
      navigate('/home');
    }
  }, []);

  // Google login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store JWT token in sessionStorage (session will persist across page reloads)
      const token = await user.getIdToken();
      sessionStorage.setItem("jwt_token", token);

      // Redirect to home page after successful login
      navigate('/home');
      alert(`Welcome, ${user.displayName}!`);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Regular login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Store JWT token in sessionStorage
      const user = auth.currentUser;
      const token = await user.getIdToken();
      sessionStorage.setItem("jwt_token", token);

      // Redirect to home page after successful login
      navigate('/home');
      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful! You can now log in.");
      setRegisterMode(false); // Switch back to login mode after successful registration
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters long.");
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      alert("Please enter your email to reset the password.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      setResetMode(false); // Switch back to login mode after sending reset email
    } catch (error) {
      console.error("Password Reset Error:", error);
      alert("Failed to send password reset email. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler (ensure proper state transition)
  const handleLogout = async () => {
    setLoading(true); // Start loading state
    try {
      await signOut(auth); // Sign out from Firebase auth
      sessionStorage.removeItem("jwt_token"); // Remove token from sessionStorage
      alert("Logged out successfully."); // Alert user of successful logout
     
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout failed. Please try again."); // Alert user of error
    } finally {
      setLoading(false); // Always reset loading state
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="title">{resetMode ? "Reset Password" : registerMode ? "Register" : "Welcome Back"}</h2>

        {resetMode ? (
          <form onSubmit={handlePasswordReset}>
            <div className="input-container">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="reset-button" type="submit">
              {loading ? "Sending..." : "Reset Password"}
            </button>
            <p>
              Remembered your password?{" "}
              <span className="toggle-mode" onClick={() => setResetMode(false)}>
                Login here
              </span>
            </p>
          </form>
        ) : registerMode ? (
          <form onSubmit={handleRegister}>
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="reset-button" type="submit">
              {loading ? "Registering..." : "Register"}
            </button>
            <p>
              Already have an account?{" "}
              <span className="toggle-mode" onClick={() => setRegisterMode(false)}>
                Login here
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="login-button" type="submit">
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="or">OR</p>
            <button className="google-button" onClick={handleGoogleLogin}>
              {loading ? "Loading..." : "Sign in with Google"}
            </button>
            <p>
              <span className="forgot-password" onClick={() => setResetMode(true)}>
                Forgot Password?
              </span>
            </p>
            <p>
              Don't have an account?{" "}
              <span className="toggle-mode" onClick={() => setRegisterMode(true)}>
                Register here
              </span>
            </p>
          </form>
        )}

        {/* Logout Button */}
{sessionStorage.getItem("jwt_token") && (
  <button 
    onClick={handleLogout} 
    className="logout-button" 
    disabled={loading} // Disable button while loading
  >
    {loading ? "Logging out..." : "Logout"}
  </button>
)}

      </div>
    </div>
  );
};

export default Login;

