
import React from "react";
import "./FotoSection.scss";
import FotoField from "@/assets/FotoField.jpeg";
  


const FotoSection = () => {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }}
  return (
    <section className="hero">
      <picture className="hero__bg">
        <img
          src={FotoField} 
          alt="Wheat field under sky"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div className="hero__overlay" />

      <div className="hero__content">
        <h1>
          Test assignment for <br /> front-end developer
        </h1>
        <p>
          What defines a good front-end developer is one that has skilled
          knowledge of HTML, CSS, JS with a vast understanding of User design
          thinking as they'll be building web interfaces with accessibility in
          mind. They should also be excited to learn, as the world of Front-End
          Development keeps evolving.
        </p>
        <button className="btn-yellow" onClick={() => scrollToId("signup")}>Sign up</button>
      </div>
    </section>
  );
};

export default FotoSection;
