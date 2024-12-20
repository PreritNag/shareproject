import React, { useEffect, useState } from 'react';
import './Dropdown.css';

const Dropdown = () => {
  const [items, setItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchItem();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Pin/unpin items
  const togglePin = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  // Sort items: pinned items first
  const sortedItems = [...items].sort((a, b) => b.pinned - a.pinned);

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropbtn">
        {isDropdownOpen ? "Close" : "Open"}
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          {sortedItems.map((item) => (
            <div key={item.id} className="dropdown-item">
              <div>
                <h3>{item.name}</h3>
                <p>{item.symbol.toUpperCase()}</p>
                <p>${item.current_price}</p>
              </div>
              <button onClick={() => togglePin(item.id)}>
                {item.pinned ? "Unpin" : "Pin"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
