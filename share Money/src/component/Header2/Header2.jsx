import React from 'react';
import './Header2.css';

import Dropdown from '../Dropdown/Dropdown';
const Header2 = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        {/* Stock 1 */}
        <div className="stock">
          <p className="stock-title">NIFTY 50</p>
          <p className="stock-price">18,250</p>
        </div>

        {/* Stock 2 */}
        <div className="stock">
          <p className="stock-title">SENSEX</p>
          <p className="stock-price">61,500</p>
        </div>

        {/* Stock 3 */}
        <div className="stock">
          <p className="stock-title">NASDAQ</p>
          <p className="stock-price">12,300</p>
        </div>

        {/* Stock 4 */}
        <div className="stock">
          <p className="stock-title">DOW JONES</p>
          <p className="stock-price">33,500</p>
        </div>

        {/* Dropdown */}
        <Dropdown />
        {/* Feedback Button */}
        <div className="feedback">
          <button className="feedback-button">Send Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default Header2;
