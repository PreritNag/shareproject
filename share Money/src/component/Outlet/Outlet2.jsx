import React from "react";
import CCarousel from "./CCarousel"; // Import the carousel component
import "./Outlet2.css";
// import "./Outlet.css";
// import './Outlet1.css'
const Outlet2 = () => {
  return (
    <div className="page2  outlet2-container">
      <div className="heading1~">
        <h1>ALL-in-one App For Learning Investment</h1>
      </div>
      <div className="heading2e">
        <h2>
          Invest in Indian Stocks, US Stocks, Direct Mutual Funds, and Fixed
          Deposits. Set up your financial goals and link them with your
          investments on INDmoney.
        </h2>
      </div>
      <div className="carousel-container">
        <CCarousel />
      </div>
    </div>
  );
};

export default Outlet2;
