import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./employee.css";
import { useSearch } from "../context/searchcontext";

const Tickets = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showActivity, setShowActivity] = useState(null);
  const {search} = useSearch();
  const [tickets, setTickets] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    employeeId: "",
    assignedTo: "",
    priority: "Low",
    status: "open",
    message: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    employeeId: "",
    assignedTo: "",
    priority: "Low",
    status: "open",
    message: "",
  });

  useEffect(() => {
    fetchTickets();
    fetchEmployees();
    fetchUsers();
    setCurrentPage(1)
  }, [search]);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployee(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form };
      if (body.assignedTo === "" || body.assignedTo === undefined) {
        body.assignedTo = null;
      }
      await api.post("/tickets/add", form);
      setShowForm(false);
      fetchTickets();
      setForm({
        title: "",
        employeeId: "",
        assignedTo: "",
        priority: "Low",
        status: "open",
        message: "",
      });
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  const openEditTicket = (t) => {
    setEditForm(t);
    setEditing(true);
  };

  const updateTicket = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tickets/update/${editForm._id}`, editForm);
      setEditing(false);
      fetchTickets();
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await api.delete(`/tickets/delete/${id}`);
      fetchTickets();
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };

  const filteredtickets = tickets.filter((t)=>
  t.title.toLowerCase().includes(search.toLowerCase())||
  t.message?.toLowerCase().includes(search.toLowerCase())||
  t.priority?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredtickets.length/ITEMS_PER_PAGE);
  const paginatedTickets = filteredtickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage* ITEMS_PER_PAGE
  );
  return (
    <div className="employees-page">
      <h1>Tickets</h1>
      <button className="add-btn" onClick={() => setShowForm(true)}> Create Ticket</button>
      {showForm && (
        <div className="popup">
          <div className="popup-box">
            <h2>Create Ticket</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Ticket Title" value={form.title} onChange={handleChange} required />
              <select name="employeeId" value={form.employeeId} onChange={handleChange} required>
                <option value="">Select Employee</option>
                {employee.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                <option value="">Assign to</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <textarea name="message" placeholder="Describe the issue" value={form.message} onChange={handleChange} />
              <div className="popup-actions">
                <button type="submit" className="save-btn"> Save </button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}> Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editing && (
        <div className="popup">
          <div className="popup-box">
            <h2>Edit Ticket</h2>
            <form onSubmit={updateTicket}>
              <input type="text" name="title" value={editForm.title} onChange={handleEditChange} required />
              <select name="priority" value={editForm.priority} onChange={handleEditChange} >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="open">Open</option>
                <option value="In progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <textarea name="message" value={editForm.message} onChange={handleEditChange} />
              <div className="popup-actions">
                <button type="submit" className="save-btn"> Update</button>
                <button className="cancel-btn" onClick={() => setEditing(false)}> Cancel </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Employee</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Message</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTickets.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.employeeId?.name}</td>
              <td>{t.assignedTo?.name || "Unassigned"}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>{t.message}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditTicket(t)}> Edit </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteTicket(t._id)} >Delete</button>
              </td>
              <td>
               <button onClick={()=>setShowActivity(t)}>Activity</button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
    {[...Array(totalPages)].map((_, i) => (
      <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
    ))}
    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
  </div>
  {showActivity && (
  <div className="popup">
    <div className="popup-box">
      <h2>Ticket Activity</h2>

      {showActivity.activity?.length > 0 ? (
        <ul>
          {showActivity.activity.map((a, i) => (
            <li key={i}>
              <b>{a.action}</b> <br />
              <small>{new Date(a.at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activity yet</p>
      )}

      <button onClick={() => setShowActivity(null)}>Close</button>
    </div>
  </div>
)}

    </div>
  );
};
export default Tickets;
