
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/TopNavbar.css";

export default function TopNavbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const updateMobileStatus = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    updateMobileStatus(); // Initial check
    window.addEventListener('resize', updateMobileStatus);
    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('resize', updateMobileStatus);
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    isMobile && (
      <div className={`top-navbar ${show ? 'show' : 'hide'}`}>
        <Link to="/" className="logo">People</Link>
        <ul className="nav-menu">
          <Link to="/draw">
            <li>
              <span style={{ marginRight: "0px" }} className="material-symbols-outlined">brush</span>
            </li>
          </Link>
          <Link to="/search">
            <li>
              <span style={{ marginRight: "20px" }} className="material-symbols-outlined">search</span>
            </li>
          </Link>
        </ul>
      </div>
    )
  );
}

