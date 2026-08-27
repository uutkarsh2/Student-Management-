"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    if (currentUser.role !== "admin") {
      router.push("/student");
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 text-lg">Loading...</p>
      </div>
    );
  }

 return (
    <main className="min-h-screen bg-slate-100">

      <nav className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎓</span>

              <h1 className="text-3xl font-bold text-slate-800">
                Student Management
              </h1>
            </div>

            <p className="text-slate-500 text-lg ml-1 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-xl font-semibold text-lg transition shadow-sm"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </nav>
      
      <div className="max-w-7xl mx-auto px-8 py-10">
       
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 mb-8">

          <p className="text-lg text-slate-500 mb-2">
            Welcome back
          </p>

          <div className="flex items-center gap-3">

            <h2 className="text-4xl font-bold text-slate-800">
              {user.name}
            </h2>

            <span className="text-4xl">
              👋
            </span>

          </div>

          <p className="text-lg text-slate-500 mt-3">
            You are logged in as an administrator.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 min-h-[330px] flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-7">
                <span className="text-4xl">
                  👨‍🎓
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                Students
              </h3>
              <p className="text-lg text-slate-500 mt-3">
                Manage student records.
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={() => router.push("/students")}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold text-lg transition shadow-sm"
              >
                <span className="text-xl">
                  👥
                </span>
                Manage Students
               </button>
               </div>
               </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 min-h-[330px]">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-7">
              <span className="text-4xl">
                👤
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">
              My Account
            </h3>
            <p className="text-lg text-slate-500 mt-3 mb-7">
              View administrator account information.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">
                  Email:
                </span>
                <span className="text-slate-600">
                  {user.email}
                </span>
              </div>
               <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">
                  Role:
                </span>
                <span className="text-slate-600 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}