import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = ({ setShowRegister }) => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = (id, currentRole) => {
    setEditUserId(id);
    setEditPassword("");
    setEditRole(currentRole);
  };

  const handleSave = async (id) => {
    if (!editPassword && !editRole) {
      alert("Please update at least one field");
      return;
    }

    try {
      const updateData = {};
      if (editPassword) updateData.password = editPassword;
      if (editRole) updateData.role = editRole;

      await axios.put(`http://localhost:5000/api/auth/users/${id}`, updateData);
      alert("User updated");
      setEditUserId(null);
      setEditPassword("");
      setEditRole("");
      fetchUsers();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">All Users</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRegister(true)}>
            Register
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ _id, username, email, role }) => (
                <tr key={_id}>
                  <td>{username}</td>
                  <td>{email}</td>
                  <td>
                    {editUserId === _id ? (
                      username === "admin01" ? (
                        role
                      ) : (
                        <select
                          className="form-select form-select-sm"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )
                    ) : (
                      role
                    )}
                  </td>
                  <td>
                    {editUserId === _id ? (
                      <>
                        <div className="d-flex align-items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-sm"
                            placeholder="New password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm ms-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </>
                    ) : (
                      "••••••••"
                    )}
                  </td>
                  <td>
                    {username === "admin01" ? (
                      <span className="text-muted">Protected</span>
                    ) : editUserId === _id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSave(_id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditUserId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEdit(_id, role)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;