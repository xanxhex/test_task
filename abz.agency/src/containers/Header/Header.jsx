import React from "react";
import Logo from "../../assets/Logo.svg?react"; 
import "../Header/Header.scss"; 

const Header = () => {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header">
      <section className="header_section">
        <div className="header__logo">
          <img src={Logo} alt="Logo" />
        </div>

        <nav className="header__nav">
          <button
            className="btn btn--yellow"
            type="button"
            onClick={() => scrollToId("users")}
          >
            Users
          </button>
          <button
            className="btn btn--yellow"
            type="button"
            onClick={() => scrollToId("signup")}
          >
            Sign up
          </button>
        </nav>
      </section>
    </header>
  );
};

export default Header;
