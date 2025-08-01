import React from "react";
import BAAM from "./BAAM.png"; 

const Navbar = ({ goHome }) => {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: "#2e3192" }}
    >
      <div className="container">
        <a
          className="navbar-brand text-white me-auto"
          href="#!"
          style={{ fontWeight: "bold" }}
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <img src={BAAM} alt="Logo" height="60" />
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
