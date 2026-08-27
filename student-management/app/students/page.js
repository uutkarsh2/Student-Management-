"use client";
import { useEffect, useState } from "react";
export default function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const getStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students"
      );
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  getStudents();
  }, []);
 const saveStudent = async (e) => {
 e.preventDefault();
    const studentData = {
      name,
      email,
      course,
    };

    try {
      if (editingId) {
        const response = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );
        const updatedStudent =
          await response.json();
        if (!response.ok) {
          console.log(updatedStudent);
          return;
        }
        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student._id === editingId
              ? updatedStudent
              : student
          )
        );
        setEditingId(null);
      }
      else {
        const response = await fetch(
          "http://localhost:5000/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );
        const newStudent =
          await response.json();
        if (!response.ok) {
          console.log(newStudent);
          return;
        }
        setStudents((currentStudents) => [
          ...currentStudents,
          newStudent,
        ]);
      }
      setName("");
      setEmail("");
      setCourse("");
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const editStudent = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setCourse("");
  };
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        return;
      }
      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student._id !== id
        )
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  🎓
                </span>
                <h1 className="text-2xl font-bold text-slate-800">
                  Student Management
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Manage student records
              </p>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
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
                : "Add a new student to the database"}
            </p>
          </div>
          <form
            onSubmit={saveStudent}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
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
            <div className="md:col-span-3 flex justify-end gap-3">
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
                  : "+ Add Student"}
              </button>
             </div>
          </form>
        </div>
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Students
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  All registered students
                </p>
              </div>
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm"> 
                {students.length} Students
              </span>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto">
              </div>
              <p className="text-slate-500 mt-4">
                Loading students...
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">
                🎓
              </div>
              <h3 className="text-xl font-semibold text-slate-700">
                No students yet
              </h3>
              <p className="text-slate-500 mt-2">
                Add your first student above.
              </p>
            </div>
          ) : (

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
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm">
                          {student.studentId}

                        </span>
                      </td>
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
                      <td className="px-6 py-4 text-slate-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                          {student.course}
                        </span>
                      </td>
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