"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // RESET LOGIN FORM
  // ==========================

  useEffect(() => {
    setEmail("");
    setPassword("");
    setRole("student");
    setError("");
    setLoading(false);
  }, []);

  // ==========================
  // LOGIN
  // ==========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid email or password."
        );

        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Clear form
      setEmail("");
      setPassword("");
      setError("");

      // Redirect
      if (data.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/student");
      }

    } catch (error) {
      console.log("Login Error:", error);

      setError(
        "Unable to connect to server. Make sure backend is running."
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            🎓
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mt-4">
            Student Management
          </h1>

          <p className="text-slate-500 mt-2">
            Login to your account
          </p>

        </div>

        {/* ==========================
            LOGIN CARD
        ========================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Login
          </h2>

          {/* ERROR */}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="space-y-5"
          >

            {/* ==========================
                LOGIN AS
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Login As
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >

                <option value="student">
                  Student
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            {/* ==========================
                EMAIL
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="off"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />

            </div>

            {/* ==========================
                PASSWORD
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />

            </div>

            {/* ==========================
                LOGIN BUTTON
            ========================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition"
            >
              {loading
                ? "Logging in..."
                : `Login as ${
                    role === "admin"
                      ? "Admin"
                      : "Student"
                  }`}
            </button>

          </form>

        </div>

        {/* ==========================
            INFO
        ========================== */}

        <p className="text-center text-sm text-slate-500 mt-6">
          Student accounts are created by the administrator.
        </p>

      </div>

    </main>
  );
}