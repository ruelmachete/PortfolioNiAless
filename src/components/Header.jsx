import { useEffect } from "react";
import './Header.css';

function Header() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScrollEffect = () => {
      const header = document.querySelector(".header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScrollEffect);
    return () => window.removeEventListener("scroll", handleScrollEffect);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span>Alessandra Nicole</span>
        </div>

        <nav className="nav-links">
          <a href="#about" onClick={(e) => handleScroll(e, "about")}>About</a>
          <a href="#skills" onClick={(e) => handleScroll(e, "skills")}>Skills</a>
          <a href="#projects" onClick={(e) => handleScroll(e, "projects")}>Projects</a>
          <a href="#certificates" onClick={(e) => handleScroll(e, "certificates")}>Certificates</a>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;