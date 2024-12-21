import React, { useEffect, useContext, useState } from 'react';
import { PortfolioContext } from '../Portfolio/PortfolioContext';
import './Portfolio.css';

const Portfolio = () => {
  const { portfolio } = useContext(PortfolioContext);
  const [balance, setBalance] = useState(portfolio?.balance || 0);
  const [assets, setAssets] = useState(portfolio?.stocks || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  // const symbol = 'MSFT'; // Example: this can be dynamic from user input

  // useEffect(() => {
  //   const fetchStockData = async () => {
  //     const symbol = 'AAPL'; // Replace this with dynamic symbol if needed
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/stocks/portfolio/Portfolio`); 
  //       console.log('API Response in portfolio.jsx:', response);
  //       const data = await response.json();
  
  //       if (response.ok) {
  //         console.log('Stock data:', data); // Log the response for debugging
  //         setAssets([data]); // Assuming you want to add the data to the assets state
  //       } else {
  //         throw new Error(data.message || 'Error fetching stock data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching stock data:', error.message);
  //       setError(error.message); // Store error in state to show in the UI
  //     }
  //   };
  
  //   fetchStockData();
  // }, []);
  
  // useEffect(() => {
  //   const fetchMockData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/stocks/${symbol}`);
  //       const data = await response.json();
  
  //       if (response.ok) {
  //         console.log('Mock data:', data);
  //         setAssets(data); // Set the data in your state
  //       } else {
  //         throw new Error(data.message || 'Error fetching mock data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching stock data:', error.message);
  //       setError(error.message); // Set error in state
  //     }
  //   };
  
  //   fetchMockData();
  // }, []);
  // useEffect(() => {
  //   const fetchPortfolio = async () => {
  //     try {
  //       const response = await fetch(
  //         'http://localhost:5000/api/stocks/portfolio/Portfolio' 
  //       );
  //       console.log('API Response in fetchportfolio in portfolio.jsx:', response);
  //       const data = await response.json();
  //       console.log('API Response:', data);
  
  //       if (!data || typeof data.balance !== 'number' || !Array.isArray(data.stocks)) {
  //         throw new Error('Portfolio data format is invalid: Missing or incorrect balance or stocks.');
  //       }
  
  //       data.stocks.forEach((stock, index) => {
  //         if (
  //           typeof stock.symbol !== 'string' ||
  //           typeof stock.quantity !== 'number' ||
  //           typeof stock.currentPrice !== 'number'
  //         ) {
  //           throw new Error(`Stock at index ${index} has invalid properties.`);
  //         }
  //       });
  
  //       setBalance(data.balance);
  //       setAssets(data.stocks);
  //     } catch (error) {
  //       console.error('Error fetching portfolio:', error.message);
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchPortfolio();
  // }, []); 
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stocks/portfolio/Portfolio');
        console.log('API Response in fetchportfolio in portfolio.jsx:', response);
        const data = await response.json();
        console.log('API Response:', data);
  
        if (!data || typeof data.balance !== 'number' || !Array.isArray(data.stocks)) {
          throw new Error('Portfolio data format is invalid: Missing or incorrect balance or stocks.');
        }
  
        // Ensure each stock has a currentPrice
        data.stocks.forEach((stock, index) => {
          // Log stock for debugging
          console.log(`Stock at index ${index}:`, stock);
  
          if (
            !stock ||
            typeof stock.symbol !== 'string' ||
            typeof stock.quantity !== 'number'
          ) {
            throw new Error(`Stock at index ${index} has invalid properties: ${JSON.stringify(stock)}`);
          }
  
          // Set default currentPrice if missing
          stock.currentPrice = stock.currentPrice || 100; // Default price if missing
        });
  
        setBalance(data.balance);
        setAssets(data.stocks);
      } catch (error) {
        console.error('Error fetching portfolio:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPortfolio();
  }, []);
  
  
  const totalAssetValue = assets.reduce((total, asset) => {
    return total + asset.quantity * asset.currentPrice;
  }, 0);

  if (loading) {
    return <div className="Portfolio">Loading portfolio...</div>;
  }

  if (error) {
    return <div className="Portfolio">Error: {error}</div>;
  }

  return (
    <div className="Portfolio">
      <h1>Portfolio</h1>

      <div className="Balance">
        <h2>Available Balance</h2>
        <h1>${balance.toFixed(2)}</h1>
      </div>

      <div className="Assets">
        <h2>My Assets</h2>
        {assets.length === 0 ? (
          <div>
            <p>No assets yet. Start trading!</p>
            <button onClick={() => navigate('/trade')}>Go to Trade</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Current Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.symbol}</td>
                  <td>{asset.quantity}</td>
                  <td>${asset.currentPrice?.toFixed(2) || 'N/A'}</td>
                  <td>${(asset.quantity * asset.currentPrice)?.toFixed(2) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="TotalValue">
        <h2>Total Portfolio Value</h2>
        <h1>${(balance + totalAssetValue).toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default Portfolio;
