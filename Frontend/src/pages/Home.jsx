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
      <main className="home-main">       
        <h1 className="landing-title">ACADEMIC ISSUE TRACKING</h1>
      </main>
    </div>
  );
};



export default Home;
