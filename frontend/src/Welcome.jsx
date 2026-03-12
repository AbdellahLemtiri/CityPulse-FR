import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Welcome/Footer";
import About from "./components/Welcome/About";
import NavBar from "./components/Welcome/NavBar";
import Safigram from "./components/Welcome/Safigram";
import Activities from "./components/Welcome/Activities";
import News from "./components/Welcome/News";
import Report from "./components/Welcome/Report";
import Hero from "./components/Welcome/Hero";
export default function Welcome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    const reveal = () => {
      var reveals = document.querySelectorAll(".reveal");
      for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col selection:bg-primary-500 selection:text-white dark:bg-slate-950 dark:text-slate-100  duration-300 scroll-smooth">
      <NavBar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-grow pt-20">
        <Hero />
        <About />
        <Safigram />
        <Activities />
        <News />
        <Report />
      </main>
      <Footer />
    </div>
  );
}
