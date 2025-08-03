// AdminLoginPage: Simple static login form with validation. Navigates to dashboard on success. Accessible and responsive.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Remove logo import
// import logo from "../logo.svg";

function AdminLoginPage() {
  // State for username, password, error message, and password visibility
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle form submit: check credentials from environment variables
  const handleSubmit = e => {
    e.preventDefault();
    const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "admin123";
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      navigate("/admin/dashboard");
    } else {
      setError(`Invalid credentials. Try ${ADMIN_USERNAME}/${ADMIN_PASSWORD}.`);
    }
  };

  return (
    // Centered login form, responsive and accessible
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <form className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-blue-100 dark:border-gray-700" onSubmit={handleSubmit}>
        <h2 className="text-center text-blue-900 dark:text-blue-200 font-extrabold text-2xl mb-6">Admin Login</h2>
        {/* Username field */}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">Username</label>
          <input id="username" type="text" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        {/* Password field with show/hide toggle */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} className="border rounded px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-sm focus:outline-none" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
          </div>
        </div>
        {/* Error message */}
        {error && <div className="text-red-600 mb-4 text-center text-sm">{error}</div>}
        {/* Login button */}
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white font-semibold py-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 transition-all">Login</button>
      </form>
    </div>
  );
}

export default AdminLoginPage; 