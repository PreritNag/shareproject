import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PortfolioContext } from '../Portfolio/PortfolioContext';
import LightweightchartLib from '../LightWeightChartLib/LightweightchartLib';

const TradingApp = () => {
  const { portfolio, updatePortfolio } = useContext(PortfolioContext);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [currentValue, setCurrentValue] = useState(0); // State to store the current value of the symbol

  // Fetch stock price periodically when the symbol changes
  useEffect(() => {
    let priceInterval;

    const fetchStockPrice = async () => {
      // Trim any leading/trailing spaces from the symbol
      const trimmedSymbol = symbol.trim();
    
      // If the symbol is empty after trimming, return early
      if (!trimmedSymbol) return;
    
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks/price?symbol=${trimmedSymbol}`);
        
        // Check if the response contains the necessary data
        if (response.data && response.data.timeSeries && response.data.timeSeries.length > 0) {
          // Get the most recent data (first element in the timeSeries array)
          const latestData = response.data.timeSeries[0]; 
          const latestPrice = latestData.close; // Get the 'close' price
    
          // Update the price state with the latest price
          setPrice(latestPrice); 
        } else {
          console.error('Price data not found in response:', response.data);
          setPrice(0); // Reset to 0 if no valid price is found
        }
      } catch (error) {
        console.error('Error fetching stock price:', error);
        setPrice(0); // Reset to 0 in case of an error
      }
    };
    

    // Start the periodic price fetching
    if (symbol) {
      priceInterval = setInterval(fetchStockPrice, 1000); // Fetch the price every 1 seconds
    }

    // Cleanup interval when the symbol is changed or component unmounts
    return () => clearInterval(priceInterval);
  }, [symbol]); // Dependency on 'symbol', so it fetches when symbol changes

  // Calculate the current value of the symbol in the portfolio
  useEffect(() => {
    const findStockInPortfolio = portfolio.stocks.find(stock => stock.symbol === symbol);
    if (findStockInPortfolio) {
      setCurrentValue(findStockInPortfolio.quantity * price); // Calculate the current value (quantity * price)
    } else {
      setCurrentValue(0); // If the symbol is not in the portfolio, set current value to 0
    }
  }, [symbol, price, portfolio]); // Recalculate when symbol, price, or portfolio changes

  // Handle trade action (buy/sell)
  const handleTrade = async (actionType) => {
    if (quantity <= 0 || price <= 0) {
      alert('Quantity and price must be positive values.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/stocks/trade', {
        symbol,
        quantity,
        price,
        action: actionType,
      });
      updatePortfolio(response.data.portfolio); // Update portfolio via context
      alert('Trade executed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Trading Simulator</h1>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Trading Panel</h3>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())} // Update symbol in state
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} // Ensure quantity is a number
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} // Ensure price is a number
          className="border rounded p-2 mr-2"
        />
        <button onClick={() => handleTrade('buy')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Buy
        </button>
        <button onClick={() => handleTrade('sell')} className="bg-red-500 text-white px-4 py-2 rounded">
          Sell
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Portfolio</h3>
        <p>Balance: ${portfolio.balance.toFixed(2)}</p>
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Symbol</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Avg Buy Price</th>
              <th className="border border-gray-300 p-2">Current Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td className="border border-gray-300 p-2">{stock.symbol}</td>
                <td className="border border-gray-300 p-2">{stock.quantity}</td>
                <td className="border border-gray-300 p-2">${stock.averageBuyPrice.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">${(stock.quantity * price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Section to Display the Current Value of Specific Symbol */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Current Value of {symbol}</h3>
        <p className="text-lg">
          {symbol ? `Current Value: $${currentValue.toFixed(2)}` : 'Please enter a symbol to see the current value.'}
        </p>
      </div>

      <LightweightchartLib symbol={symbol} />
    </div>
  );
};

export default TradingApp;
