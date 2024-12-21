const stockService = require('../service/Stockservice');
const Portfolio = require('../models/portfolioModel'); // Import the Portfolio model
const { fetchAndStoreStockData } = require('../service/Stockservice'); // Import the new service function

// API Route: Get stock data
const getStockData = async (req, res) => {
  const { symbol, date } = req.params;

  // Validate symbol and date
  if (!symbol) {
    return res.status(400).json({ message: 'Stock symbol is required' });
  }
  if (isNaN(new Date(date))) {
    return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
  }

  const normalizedSymbol = symbol.toUpperCase();

  try {
    const stock = await stockService.getStockData(normalizedSymbol, new Date(date));
    if (!stock) {
      return res.status(404).json({ message: 'Stock data not found for the given symbol and date.' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error(`Error fetching stock data: ${error.message}`); // Improved error logging
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// API Route: Fetch and store stock data from external source (e.g., Alpha Vantage)
const fetchAndStoreStockDataController = async (req, res) => {
  const { symbol, date } = req.body;

  if (!symbol || !date) {
    return res.status(400).json({ message: 'Stock symbol and date are required' });
  }

  try {
    // Fetch and store stock data
    await fetchAndStoreStockData(symbol, date);
    res.status(200).json({ message: `Stock data for ${symbol} on ${date} processed successfully!` });
  } catch (error) {
    console.error(`Failed to fetch or store stock data for ${symbol} on ${date}:`, error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to find stock in portfolio
const isValidNumber = (value) => typeof value === 'number' && value > 0;

// API Route: Store stock data
const storeStockData = async (req, res) => {
  const stockData = req.body;

  if (!stockData.stockSymbol || !stockData.date) {
    return res.status(400).json({ message: 'Missing required fields: stockSymbol, date' });
  }

  try {
    await stockService.storeStockData(stockData);
    res.status(201).json({ message: 'Stock data stored successfully' });
  } catch (error) {
    console.error('Error storing stock data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to find stock in portfolio
const findStock = (portfolio, symbol) => portfolio.stocks.find((stock) => stock.symbol === symbol);

// Trade function to buy or sell stocks
const tradeStock = async (req, res) => {
  const { symbol, quantity, price, action } = req.body;

  if (!symbol || !isValidNumber(quantity) || !isValidNumber(price) || !action) {
    return res.status(400).json({ message: 'Invalid input: Ensure symbol, quantity, price, and action are correct' });
  }

  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio({ balance: 100000, stocks: [] }); // Initialize a default portfolio
    }

    if (action === 'buy') {
      const cost = price * quantity;
      if (portfolio.balance < cost) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      let stock = findStock(portfolio, symbol);
      if (stock) {
        stock.averageBuyPrice =
          (stock.averageBuyPrice * stock.quantity + cost) / (stock.quantity + quantity);
        stock.quantity += quantity;
      } else {
        portfolio.stocks.push({ symbol, quantity, averageBuyPrice: price });
      }
      portfolio.balance -= cost;
    } else if (action === 'sell') {
      const stock = findStock(portfolio, symbol);
      if (!stock || stock.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock quantity' });
      }

      const revenue = price * quantity;
      stock.quantity -= quantity;
      if (stock.quantity === 0) {
        portfolio.stocks = portfolio.stocks.filter((s) => s.symbol !== symbol);
      }
      portfolio.balance += revenue;
    } else {
      return res.status(400).json({ message: 'Invalid action: Use "buy" or "sell"' });
    }

    await portfolio.save();
    res.json({ portfolio, balance: portfolio.balance });
  } catch (error) {
    console.error('Error in tradeStock:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get the portfolio
const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio({ balance: 100000, stocks: [] }); // Initialize a default portfolio
      await portfolio.save();
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error in getPortfolio:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getStockData,
  storeStockData,
  tradeStock,
  getPortfolio,
  fetchAndStoreStockDataController // Export the new function
};
