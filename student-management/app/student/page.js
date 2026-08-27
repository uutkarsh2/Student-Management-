"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(storedUser);
    if (currentUser.role !== "student") {
      router.push("/admin");
      return;
    }
    setUser(currentUser);
  }, [router]);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Loading...
        </p>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              🎓 Student Management
            </h1>
            <p className="text-sm text-slate-500">
              Student Dashboard
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="text-5xl mb-4">
            👋
          </div>
          <p className="text-sm text-slate-500">
            Welcome
          </p>
          <h2 className="text-3xl font-bold text-slate-800">
            {user.name}
          </h2>
          <p className="text-slate-500 mt-2">
            Welcome to your student dashboard.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            My Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Full Name
              </p>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {user.name}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Email
              </p>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {user.email}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Account Type
              </p>
              <p className="text-lg font-semibold text-blue-600 mt-1 capitalize">
                {user.role}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Account Status
              </p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}