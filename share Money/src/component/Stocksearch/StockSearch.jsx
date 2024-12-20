import React, { useState } from "react";
import axios from "axios";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // User's search input
  const [results, setResults] = useState([]); // API search results
  const [selectedStock, setSelectedStock] = useState(null); // Selected stock details
  const [loading, setLoading] = useState(false); // Loading state

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=YOUR_API_KEY`
      );
      setResults(response.data.bestMatches || []);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setResults([]); // Clear results after selecting
    setQuery(""); // Clear input field
  };

  return (
    <div className="search-bar1">
      <div className="input-container1">
        <input
          type="text"
          value={query}
          placeholder="Search for a stock..."
          onChange={(e) => setQuery(e.target.value)}
          className="search-input1"
        />
        <button onClick={handleSearch} className="search-button2">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* Display search results */}
      {results.length > 0 && (
        <div className="search-results1">
          {results.map((stock, index) => (
            <div
              key={index}
              className="result-item1"
              onClick={() => handleSelectStock(stock)}
            >
              <p>{stock["1. symbol"]}</p>
              <p>{stock["2. name"]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Display selected stock details */}
      {selectedStock && (
        <div className="stock-details1">
          <h3>Stock Details</h3>
          <p><strong>Symbol:</strong> {selectedStock["1. symbol"]}</p>
          <p><strong>Name:</strong> {selectedStock["2. name"]}</p>
          <p><strong>Region:</strong> {selectedStock["4. region"]}</p>
          <p><strong>Currency:</strong> {selectedStock["8. currency"]}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
