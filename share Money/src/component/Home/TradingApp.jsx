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

  // Fetch real-time stock price
  useEffect(() => {
    const fetchStockPrice = async () => {
      if (!symbol) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks/price?symbol=${symbol}`);
        setPrice(response.data.price);
      } catch (error) {
        console.error('Error fetching stock price:', error);
      }
    };

    fetchStockPrice();
  }, [symbol]);

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
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
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

      <LightweightchartLib symbol={symbol} />
    </div>
  );
};

export default TradingApp;
