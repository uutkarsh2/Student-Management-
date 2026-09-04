"use client";

import { useEffect, useState } from "react";


export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // GET STUDENT PROFILE
  // ==========================
  const getStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/student/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load student profile."
        );
        setLoading(false);
        return;
      }

      setStudent(data.student);
    } catch (error) {
      console.log("Student Profile Error:", error);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD DATA
  // ==========================
  useEffect(() => {
    getStudentProfile();
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-slate-600">
            Loading your profile...
          </p>

        </div>
      </main>
    );
  }

  // ==========================
  // ERROR
  // ==========================
  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center max-w-md w-full">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Unable to Load Profile
          </h2>

          <p className="text-red-600 mt-3">
            {error}
          </p>

          <button
            onClick={logout}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Back to Login
          </button>

        </div>

      </main>
    );
  }

  
       return (
  <main className="min-h-screen bg-slate-100">
        

        <nav className="bg-white border-b border-slate-200">

          <div className="max-w-6xl mx-auto px-6 py-5">

            <div className="flex items-center justify-between">

              {/* LOGO */}

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-2xl">
                  🎓
                </div>

                <div>

                  <h1 className="text-xl font-bold text-slate-800">
                    Student Portal
                  </h1>

                  <p className="text-sm text-slate-500">
                    Student Dashboard
                  </p>

                </div>

              </div>

              {/* LOGOUT */}

              <button
                onClick={logout}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
              >
                Logout
              </button>

            </div>

          </div>

        </nav>

        {/* ==========================
            CONTENT
        ========================== */}

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* ==========================
              WELCOME CARD
          ========================== */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8">

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">

              {/* AVATAR */}

              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">

                {student?.name
                  ?.charAt(0)
                  .toUpperCase()}

              </div>

              {/* WELCOME TEXT */}

              <div className="text-center sm:text-left">

                <p className="text-blue-100 text-sm">
                  Welcome back
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {student?.name}
                </h2>

                <p className="text-blue-100 mt-1">
                  Student ID: {student?.studentId}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================
              PROFILE
          ========================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-200">

              <h2 className="text-2xl font-bold text-slate-800">
                My Profile
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your registered student information
              </p>

            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* STUDENT ID */}

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Student ID
                </p>

                <p className="text-xl font-bold text-blue-600 mt-2">
                  {student?.studentId}
                </p>

              </div>

              {/* NAME */}

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="text-xl font-bold text-slate-800 mt-2">
                  {student?.name}
                </p>

              </div>

              {/* EMAIL */}

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Email Address
                </p>

                <p className="text-lg font-semibold text-slate-800 mt-2 break-all">
                  {student?.email}
                </p>

              </div>

              {/* COURSE */}

              <div className="bg-slate-50 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Course
                </p>

                <p className="text-xl font-bold text-slate-800 mt-2">
                  {student?.course}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================
              ACCOUNT STATUS
          ========================== */}

          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold text-slate-800">
              Account Status
            </h2>

            <div className="flex items-center gap-3 mt-4">

              <div className="w-3 h-3 bg-green-500 rounded-full"></div>

              <span className="text-green-600 font-semibold">
                Active
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-2">
              Your student account is active and managed by the administrator.
            </p>

          </div>

        </div>

      </main>

    
  );
}