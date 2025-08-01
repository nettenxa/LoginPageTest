import React from "react";

const Navbar = ({ goHome }) => {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: "#2e3192" }}
    >
      <div className="container">
        <a
          className="navbar-brand text-white"
          href="#!"
          style={{ fontWeight: "bold" }}
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          NETTEN
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  goHome();
                }}
              >
                Home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
