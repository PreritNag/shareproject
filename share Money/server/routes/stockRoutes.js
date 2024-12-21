const express = require('express');
const { getStockData, getHistoricalStockData } = require('../Stockdata/Stockdata');  // Import the function to fetch stock data
const StockData = require('../models/Stock');  // Import the StockData model
const router = express.Router();
const { tradeStock, getPortfolio, fetchAndStoreStockDataController } = require('../controller/stockController'); // Import the new function

// Route to get all stock data from MongoDB
router.get('/', async (req, res) => {
  try {
    const stocks = await StockData.find();
    console.log("in  ALL stockRoutes.js "+stocks);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks', error: error.message });
  }
});

// Route to get real-time stock data from Alpha Vantage
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log("in REALs stockRoutes.js "+symbol);
  try {
    const stockData = await getStockData(symbol);
    if (!stockData) {
      return res.status(404).json({ message: 'Stock data not found.' });
    }
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data from API.', error: error.message });
  }
});

// Route to get historical stock data from Alpha Vantage (daily)
router.get('/historical/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log("in HISTORICAL stockRoutes.js "+symbol);
  try {
    const historicalData = await getHistoricalStockData(symbol);
    if (historicalData.message) {
      return res.status(404).json({ message: historicalData.message });
    }
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical stock data from API.', error: error.message });
  }
});

// Route to add new stock data to MongoDB
router.post('/', async (req, res) => {
  const { symbol, date, open, high, low, close, volume } = req.body;
  const newStock = new StockData({ symbol, date, open, high, low, close, volume });
  console.log("in / stockRoutes.js "+newStock);
  try {
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    res.status(400).json({ message: 'Error saving stock data', error: error.message });
  }
});
router.get('/stocks/:symbol', async (req, res) => {
  const { symbol } = req.params;
 console.log("in STOCK stockRoutes.js "+symbol);
  try {
    const data = await StockData.find({ symbol }).sort({ date: 1 }); // Sort by date ascending
    if (data.length === 0) {
      return res.status(404).json({ message: 'Stock data not found.' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data.' });
  }
});

// router.get('/portfolio', async (req, res) => {
//   try {
//     // Assuming userId is sent as a query parameter
//     const userId = req.query.userId;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     const portfolio = await PortfolioModel.findOne({ userId });

//     if (!portfolio) {
//       return res.status(404).json({ message: 'Portfolio not found' });
//     }

//     // Process stocks (if needed)
//     const stocksWithPrices = await Promise.all(portfolio.stocks.map(async (stock) => {
//       const stockData = await getStockPrice(stock.symbol); // Function to fetch stock price
//       return {
//         ...stock,
//         currentPrice: stockData.price,
//       };
//     }));

//     portfolio.stocks = stocksWithPrices;

//     res.json(portfolio);
//   } catch (error) {
//     console.error('Error fetching portfolio:', error);
//     res.status(500).json({
//       message: 'Error fetching stock data from API.',
//       error: error.message,
//     });
//   }
// });
// Mock stock data
const mockData = require('../datas/mock_stock_data.json'); 

// Mock data route
router.get('/mock/data', (req, res) => {
  // Ensure the data is returned correctly
  if (!mockData || mockData.length === 0) {
    return res.status(404).json({ message: 'No data available for mock stock data.' });
  }

  res.status(200).json(mockData); // Return mock data
});
// const mockData = [
//   { symbol: 'AAPL', quantity: 50, currentPrice: 150.25 },
//   { symbol: 'GOOGL', quantity: 10, currentPrice: 2800.50 },
//   { symbol: 'MSFT', quantity: 30, currentPrice: 300.75 },
// ];

// // Route to fetch data for a specific symbol (e.g., /api/stocks/AAPL)
// router.get('/mock/:symbol', (req, res) => {
//   const { symbol } = req.params;
//   console.log("in mock stockRoutes.js "+symbol);
//   const stock = mockData.find((s) => s.symbol === symbol);
  
//   if (!stock) {
//     return res.status(404).json({ message: `No data available for symbol ${symbol}` });
//   }

//   res.status(200).json(stock);  // Return stock data for the requested symbol
// });


// POST route for trading stocks (buy/sell)
router.post('/trade', tradeStock);

// GET route to retrieve portfolio data
router.get('/portfolio/Portfolio', getPortfolio);

// New route to fetch and store stock data from an external API (e.g., Alpha Vantage)
router.post('/fetch-and-store', fetchAndStoreStockDataController);

module.exports = router;