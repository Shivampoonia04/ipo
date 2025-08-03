// App.js: Sets up routing for Upcoming IPOs, Admin Login, and Admin Dashboard pages.
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UpcomingIPOsPage from "./pages/UpcomingIPOsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      {/* Responsive Header with right-aligned Admin Login button */}
      <header className="sticky top-0 z-20 w-full bg-white dark:bg-gray-800 shadow-md py-4 px-4 md:px-8 flex flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">IPO Platform</h1>
        <Link to="/admin/login" className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 font-semibold transition-all text-center ml-auto">
          Admin Login
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<UpcomingIPOsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
