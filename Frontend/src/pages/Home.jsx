import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
       {/* Top navigation bar */}
       <header className="home-header">
        <nav>
          <ul>
            <li><a href="/login">LOGIN</a></li>
            <li><a href="/register">REGISTER</a></li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="Home-main">
        {/* Replace the src with the path to your Makerere University logo */}
        <img
          className="-logo"
          src="/images/makerere_logo.png"
          alt="Makerere University Logo"
        />
        <h1 className="landing-title">FAMS</h1>

        <div className="campus-links">
          <a href="/main-campus">MAIN CAMPUS</a>
          <a href="/acmis">ACMIS</a>
          <a href="/cit">CIT</a>
        </div>
      </main>
    </div>
  );
};



export default Home;
