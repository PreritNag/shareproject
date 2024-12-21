import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PortfolioContext = createContext({
  portfolio: { balance: 1000, stocks: [] },
  updatePortfolio: () => {},
  fetchPortfolio: () => {},
  loading: false,
});

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState({ balance: 1000, stocks: [] });
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/stocks/portfolio/Portfolio'); 
      if (response.data && typeof response.data.balance === 'number' && Array.isArray(response.data.stocks)) {
        setPortfolio(response.data);
      } else {
        throw new Error('Invalid portfolio data format received.');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error.message);
      setPortfolio({ balance: 1000, stocks: [] }); // Fallback data
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolio = (newPortfolio) => {
    setPortfolio(newPortfolio);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, updatePortfolio, fetchPortfolio, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};
