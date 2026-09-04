"use client";

import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== allowedRole) {
        if (user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/student";
        }

        return;
      }

      setChecking(false);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
  }, [allowedRole]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-slate-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return children;
}