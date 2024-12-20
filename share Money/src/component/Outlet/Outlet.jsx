import React, { useState } from 'react';
import picture from './indmoney-homepage-header-image.avif';
import './Outlet.css';
import './Outlet1.css'
const Outlet = () => {
    const [isHovered, setIsHovered] = useState(false);
  return (
    <div className='outlet1-container'>
      <header className="heading1">
        <h2>All in One Stock Market Learning Platform</h2>
      </header>
      <section className="heading2">
        <h1>Build your dream portfolio without spending a penny!</h1>
      </section>
      <header className="heading3">
        <h2>Your first step to financial freedom starts here—no money, no risk, just learning.</h2>
      </header>
      <div className="button1">
      <button
      style={{
        color: isHovered ? 'black' : 'white',
        backgroundColor: isHovered ? 'white' : '#65b01d',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
    >
      Open FREE Demat Account
    </button>
      </div>
      <div className="image1">
        <img src={picture} alt="Stock Market Simulation Banner" />
      </div>
    </div>
  );
};

export default Outlet;
