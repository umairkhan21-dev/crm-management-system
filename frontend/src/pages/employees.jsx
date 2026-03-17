import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./employee.css";
import {useAuth} from "../context/authcontext"
import { useSearch } from "../context/searchcontext";

const Employees = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const {search,setSearch} = useSearch();
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

 const {user} = useAuth();
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  useEffect(() => {
    setSearch("");
    fetchEmployees();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const openEditEmployee = (emp) => {
    setEditForm(emp);
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/employees/add`, form);
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", company: "", notes: "" });
      fetchEmployees();
    } catch (err) {
      console.error("Failed to add employees", err);
    }
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employees/update/${editForm._id}`, editForm);
      setEditing(false);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to update employee", err);
    }
  };

 
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/delete/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employee", err);
    }
  };
  const filteredEmployees = employees.filter((e)=>
  e.name.toLowerCase().includes(search.toLowerCase())||
  e.email.toLowerCase().includes(search.toLowerCase())||
  e.phone?.includes(search));

  const totalPages = Math.ceil(filteredEmployees.length/ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage*ITEMS_PER_PAGE
  );

  return (
    <div className="employees-page">
      <h1>Employees</h1>
      {user.role === "admin" && (
      <button className="add-btn" onClick={() =>{ setSearch(""); setShowForm(true)}}>
        + Add Employee
      </button>
      )}

     
      {showForm && (
        <div className="popup">
          <div className="popup-box">
            <h2>Add Employee</h2>

            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Full Name"
                value={form.name} onChange={handleChange} required />

              <input type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange} />

              <input type="text" name="phone" placeholder="Phone"
                value={form.phone} onChange={handleChange} />

              <input type="text" name="company" placeholder="Company"
                value={form.company} onChange={handleChange} />

              <textarea name="notes" placeholder="Notes"
                value={form.notes} onChange={handleChange} />

              <div className="popup-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn"
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {editing && (
        <div className="popup">
          <div className="popup-box">
            <h2>Edit Employee</h2>

            <form onSubmit={updateEmployee}>
              <input type="text" name="name" placeholder="Full Name"
                value={editForm.name} onChange={handleEditChange} required />

              <input type="email" name="email" placeholder="Email"
                value={editForm.email} onChange={handleEditChange} />

              <input type="text" name="phone" placeholder="Phone"
                value={editForm.phone} onChange={handleEditChange} />

              <input type="text" name="company" placeholder="Company"
                value={editForm.company} onChange={handleEditChange} />

              <textarea name="notes" placeholder="Notes"
                value={editForm.notes} onChange={handleEditChange} />

              <div className="popup-actions">
                <button type="submit" className="save-btn">Update</button>
                <button type="button" className="cancel-btn"
                  onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Notes</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {paginatedEmployees.map((e) => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.phone}</td>
              <td>{e.company}</td>
              <td>{e.notes}</td>

              <td><button className="edit-btn" onClick={() => openEditEmployee(e)}>Edit</button></td>
              {user.role === "admin"&&(
              <td><button className="delete-btn"
                onClick={() => deleteEmployee(e._id)}>Delete</button></td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredEmployees.length > ITEMS_PER_PAGE && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        className={currentPage === i + 1 ? "active" : ""}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default Employees;
