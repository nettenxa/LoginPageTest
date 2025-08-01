import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import Register from "./components/Register";
import AllUsers from "./components/AllUsers";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
    setShowAllUsers(false);
  };

    const goHome = () => {
    setShowRegister(false);
    setShowAllUsers(false);
  };
  
  // ฟังก์ชันช่วยแสดงหน้าจอหลัก
  const renderMainContent = () => {
    if (showRegister) {
      return (
        <>
          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-secondary"
              onClick={() => setShowRegister(false)}
            >
              ← Back
            </button>
          </div>
          <Register setShowRegister={setShowRegister} />
        </>
      );
    }

    if (showAllUsers && user?.role === "admin") {
      return (
        <>
          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAllUsers(false)}
            >
              ← Back
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <AllUsers setShowRegister={setShowRegister} />
        </>
      );
    }

    if (!user) {
      return <LoginPage setUser={setUser} />;
    }

    // หน้า welcome หลัง login
    return (
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-4">
          Welcome, <strong>{user.username}</strong> ({user.role})
        </h3>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>

          {user.role === "admin" && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => setShowRegister(true)}
              >
                Go to Register
              </button>
              <button
                className="btn btn-info"
                onClick={() => setShowAllUsers(true)}
              >
                View All Users
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar goHome={goHome} />
      <div className="container mt-5">{renderMainContent()}</div>
    </>
  );
}

export default App;
