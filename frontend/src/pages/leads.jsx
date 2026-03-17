import React, { useEffect, useState } from "react";
import {useAuth} from "../context/authcontext";
import api from "../services/api";
import "./employee.css";
import { useSearch } from "../context/searchcontext";

const Leads = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showActivity, setShowActivity] = useState(null);
  const {user} = useAuth();
  const {search} = useSearch();
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "others",
    status: "New",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "others",
    status: "New",
    notes: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to load leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/leads/add`, form);

      setShowForm(false);
      setForm({ name: "", email: "", phone: "", source: "others", status: "New", notes: "" });
      fetchLeads();
    } catch (err) {
      console.error("Failed to add leads", err);
    }
  };

  const openEditLead = (lead) => {
    setEditForm(lead);
    setEditing(true);
  };

  const updateLead = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leads/update/${editForm._id}`, editForm);
      setEditing(false);
      fetchLeads();
    } catch (err) {
      console.error("Failed to update lead", err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await api.delete(`/leads/delete/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };
  const filteredleads = leads.filter((l) => 
  l.name.toLowerCase().includes(search.toLowerCase())||
  l.email?.toLowerCase().includes(search.toLowerCase())||
  l.status?.toLowerCase().includes(search.toLowerCase())||
  l.source?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredleads.length/ITEMS_PER_PAGE);
  const paginatedLeads = filteredleads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage* ITEMS_PER_PAGE
  );

  return (
    <div className="employees-page">
      <h1>Leads</h1>

      <button className="add-btn" onClick={() => setShowForm(true)}>
        + Add Lead
      </button>
      {showForm && (
        <div className="popup">
          <div className="popup-box">
            <h2>Add Lead</h2>

            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Full Name"
                value={form.name} onChange={handleChange} required />

              <input type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange} />

              <input type="text" name="phone" placeholder="Phone"
                value={form.phone} onChange={handleChange} />

              <select name="source" value={form.source} onChange={handleChange}>
                <option value="others">Others</option>
                <option value="website">Website</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
              </select>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>


              <textarea name="notes" placeholder="Notes"
                value={form.notes} onChange={handleChange} />

              <div className="popup-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
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
            <h2>Edit Lead</h2>

            <form onSubmit={updateLead}>
              <input type="text" name="name" placeholder="Full Name"
                value={editForm.name} onChange={handleEditChange} required />

              <input type="email" name="email" placeholder="Email"
                value={editForm.email} onChange={handleEditChange} />

              <input type="text" name="phone" placeholder="Phone"
                value={editForm.phone} onChange={handleEditChange} />

              <select name="source" value={editForm.source} onChange={handleEditChange}>
                <option value="others">Others</option>
                <option value="website">Website</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
              </select>

              <select name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>


              <textarea name="notes" placeholder="Notes"
                value={editForm.notes} onChange={handleEditChange} />

              <div className="popup-actions">
                <button type="submit" className="save-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
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
            <th>Name</th><th>Email</th><th>Phone</th>
            <th>Source</th><th>Status</th><th>Notes</th>
            <th>Edit</th><th>Delete</th><th>Acticity</th>
          </tr>
        </thead>

        <tbody>
          {paginatedLeads.map((l) => (
            <tr key={l._id}>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.phone}</td>
              <td>{l.source}</td>
              <td>{l.status}</td>
              <td>{l.notes}</td>

              <td>
              {user.role==="admin" || l.assignedTo?._id=== user.id || l.assignedTo=== user.id ?(
                <button onClick={()=>openEditLead(l)}>Edit</button>
              ):null}
              </td>

              <td>
                <button className="delete-btn" onClick={() => deleteLead(l._id)}>
                  Delete
                </button>
              </td>
              <td>
                <button onClick={()=>setShowActivity(l)}>Activity</button>
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
      <h2>Lead Activity</h2>

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

export default Leads;
