"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
useEffect(() => {
  fetch("http://localhost:5000/api/students")
    .then((response) => response.json())
    .then((data) => setStudents(data));
}, []);
 const addStudent = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "http://localhost:5000/api/students",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        course,
      }),
    }
  );

  const student = await response.json();

  setStudents([...students, student]);

  setName("");
  setEmail("");
  setCourse("");
};

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div>

      <h1>Student Management System</h1>

      <h2>Add Student</h2>

      <form onSubmit={addStudent}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button type="submit">
          Add Student
        </button>

      </form>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student.id}>

          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Course: {student.course}</p>

          <button onClick={() => deleteStudent(student.id)}>
            Delete
          </button>

          <hr />

        </div>
      ))}

    </div>
  );
}