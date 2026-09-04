"use client";

import { useEffect, useState } from "react";


export default function Students() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/students";

  // ==========================
  // GET TOKEN
  // ==========================

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  // ==========================
  // GET STUDENTS
  // ==========================

  const getStudents = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please login as admin first.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load students."
        );

        setLoading(false);
        return;
      }

      setStudents(data);
    } catch (error) {
      console.log("Get Students Error:", error);

      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD STUDENTS
  // ==========================

  useEffect(() => {
    getStudents();
  }, []);

  // ==========================
  // ADD / UPDATE STUDENT
  // ==========================

  const saveStudent = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please login as admin first.");
      return;
    }

    try {
      // ==========================
      // UPDATE STUDENT
      // ==========================

      if (editingId) {
        const studentData = {
          name,
          email,
          course,
        };

        const response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(studentData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to update student."
          );

          return;
        }

        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student._id === editingId
              ? data.student
              : student
          )
        );

        setMessage(
          "Student updated successfully."
        );

        cancelEdit();

        return;
      }

      // ==========================
      // CREATE STUDENT
      // ==========================

      if (!password) {
        setError("Please enter a student password.");
        return;
      }

      if (password.length < 6) {
        setError(
          "Student password must be at least 6 characters."
        );

        return;
      }

      const studentData = {
        name,
        email,
        course,
        password,
      };

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create student."
        );

        return;
      }

      // IMPORTANT:
      // Backend returns data.student
      // NOT the complete response object.

      setStudents((currentStudents) => [
        data.student,
        ...currentStudents,
      ]);

      setMessage(
        `Student created successfully. Student ID: ${data.student.studentId}`
      );

      // Clear form

      setName("");
      setEmail("");
      setCourse("");
      setPassword("");
    } catch (error) {
      console.log("Save Student Error:", error);

      setError("Unable to connect to server.");
    }
  };

  // ==========================
  // EDIT STUDENT
  // ==========================

  const editStudent = (student) => {
    setEditingId(student._id);

    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setPassword("");

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // CANCEL EDIT
  // ==========================

  const cancelEdit = () => {
    setEditingId(null);

    setName("");
    setEmail("");
    setCourse("");
    setPassword("");

    setMessage("");
    setError("");
  };

  // ==========================
  // DELETE STUDENT
  // ==========================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("Please login as admin first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to delete student."
        );

        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student._id !== id
        )
      );

      setMessage(
        "Student and login account deleted successfully."
      );
    } catch (error) {
      console.log("Delete Student Error:", error);

      setError("Unable to connect to server.");
    }
  };

  // ==========================
  // LOGOUT
  // ==========================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ==========================
  // PAGE
  // ==========================

   return (
  <main className="min-h-screen bg-slate-100">

        {/* ================= NAVBAR ================= */}

        <nav className="bg-white border-b border-slate-200">

          <div className="max-w-7xl mx-auto px-6 py-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="text-4xl">
                  🎓
                </span>

                <div>

                  <h1 className="text-2xl font-bold text-slate-800">
                    Student Management
                  </h1>

                  <p className="text-sm text-slate-500">
                    Manage student accounts
                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
              >
                Logout
              </button>

            </div>

          </div>

        </nav>

        {/* ================= CONTENT ================= */}

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {/* ================= FORM ================= */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-slate-800">

                {editingId
                  ? "Edit Student"
                  : "Add New Student"}

              </h2>

              <p className="text-sm text-slate-500 mt-1">

                {editingId
                  ? "Update student information"
                  : "Create a student and their login account"}

              </p>

            </div>

            <form
              onSubmit={saveStudent}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student Name
                </label>

                <input
                  type="text"
                  placeholder="Enter student name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student Email
                </label>

                <input
                  type="email"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* COURSE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Course
                </label>

                <input
                  type="text"
                  placeholder="Enter course"
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* PASSWORD */}

              {!editingId && (
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Login Password
                  </label>

                  <input
                    type="password"
                    placeholder="Create student password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 6 characters
                  </p>

                </div>
              )}

              {/* BUTTONS */}

              <div className="md:col-span-2 flex justify-end gap-3">

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >

                  {editingId
                    ? "Update Student"
                    : "+ Create Student"}

                </button>

              </div>

            </form>

          </div>

          {/* ================= STUDENT LIST ================= */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-200">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    Students
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    All students created by the administrator
                  </p>

                </div>

                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  {students.length} Students
                </span>

              </div>

            </div>

            {/* ================= LOADING ================= */}

            {loading ? (

              <div className="p-12 text-center">

                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                <p className="text-slate-500 mt-4">
                  Loading students...
                </p>

              </div>

            ) : students.length === 0 ? (

              /* ================= EMPTY ================= */

              <div className="p-12 text-center">

                <div className="text-5xl mb-4">
                  🎓
                </div>

                <h3 className="text-xl font-semibold text-slate-700">
                  No students yet
                </h3>

                <p className="text-slate-500 mt-2">
                  Create your first student above.
                </p>

              </div>

            ) : (

              /* ================= TABLE ================= */

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Student ID
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Name
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Course
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map((student) => (

                      <tr
                        key={student._id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        {/* STUDENT ID */}

                        <td className="px-6 py-4">

                          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm">
                            {student.studentId}
                          </span>

                        </td>

                        {/* NAME */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">

                              {student.name
                                ?.charAt(0)
                                .toUpperCase()}

                            </div>

                            <span className="font-semibold text-slate-800">
                              {student.name}
                            </span>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4 text-slate-600">
                          {student.email}
                        </td>

                        {/* COURSE */}

                        <td className="px-6 py-4">

                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                            {student.course}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                editStudent(student)
                              }
                              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteStudent(
                                  student._id
                                )
                              }
                              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>
  
  );
}