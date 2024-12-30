const express = require('express');
const axios = require('axios');  // We will use axios to make HTTP requests
const { getStockData, getHistoricalStockData } = require('../Stockdata/Stockdata');  // Import the function to fetch stock data
const StockData = require('../models/Stock');  // Import the StockData model
const router = express.Router();
const { tradeStock, getPortfolio, fetchAndStoreStockDataController } = require('../controller/stockController'); // Import the new function

// Route to get all stock data from MongoDB.This is working good 
//http://localhost:5000/api/stocks/All
router.get('/All', async (req, res) => {
  try {
    const stocks = await StockData.find();
    console.log("in  ALL stockRoutes.js "+stocks);
    res.json(stocks); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks', error: error.message });
  } 
}); 
//Error in this route
//[1] Error fetching stock data for AAPL on undefined: No data available for symbol AAPL on undefined
//[1] Falling back to mock API for symbol: AAPL
//[1] Error from mock API: mockResponse.data.find is not a function
//[1] Error fetching stock price: Both Alpha Vantage and mock APIs failed for symbol AAPL  
router.get('/price', async (req, res) => {
  const { symbol } = req.query; // Extract the stock symbol from query parameters
  if (!symbol) {
    return res.status(400).json({ message: 'Symbol is required' }); // Return error if symbol is not provided
  }

  try {
    const stockData = await getStockData(symbol); // Fetch real-time data
    if (!stockData) {
      console.log(`No data found for symbol: ${symbol}. Falling back to mock data.`);
      // Fallback to mock data if real data is not found
      const mockResponse = {
        stocks: [
          { symbol: 'AAPL', price: 150 }, // Example mock data
          // other mock data can be added here
        ]
      };

      // Ensure mockResponse.stocks is an array
      if (Array.isArray(mockResponse.stocks)) {
        const mockData = mockResponse.stocks.find(stock => stock.symbol === symbol);
        if (mockData) {
          return res.json(mockData); // Return mock data if found
        } else {
          return res.status(404).json({ message: 'Mock data not found for symbol.' });
        }
      } else {
        return res.status(500).json({ message: 'Mock response is not valid.' });
      }
    }

    res.json(stockData); // Send the fetched stock data as a JSON response
  } catch (error) {
    console.error('Error fetching stock price:', error.message); // Log the error message
    res.status(500).json({ message: 'Error fetching stock data.' }); // Return error response
  }
});



// Route to get real-time stock data from Alpha Vantage, or fallback to mock API if Alpha Vantage fails
//this is working good http://localhost:5000/api/stocks/symbol/AAPL
router.get('/symbol/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log("in REALs stockRoutes.js " + symbol);

  try {
    const stockData = await getStockData(symbol);
    if (!stockData) {
      return res.status(404).json({ message: 'Stock data not found.' });
    }
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data from Alpha Vantage:', error.message);

    // If Alpha Vantage API fails, fall back to mock API
    try {
      console.log('Falling back to mock API...');
      const mockApiResponse = await axios.get('http://localhost:5002/api/stocks/data');
      const mockData = mockApiResponse.data[symbol];  // Look for the symbol in the mock API data

      if (mockData) {
        res.json(mockData);
      } else {
        res.status(404).json({ message: `No data available for symbol ${symbol} in mock API.` });
      }
    } catch (mockError) {
      console.error('Error fetching data from mock API:', mockError.message);
      res.status(500).json({ message: 'Error fetching stock data from both Alpha Vantage and mock API.' });
    }
  }
});
//this is working good http://localhost:5000/api/stocks/historical/AAPL
router.get('/historical/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log("in HISTORICAL stockRoutes.js " + symbol);

  try {
    const historicalData = await getHistoricalStockData(symbol);
    if (historicalData.message) {
      return res.status(404).json({ message: historicalData.message });
    }
    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical stock data from Alpha Vantage:', error.message);

    // If Alpha Vantage fails, fall back to mock data
    try {
      console.log('Falling back to mock API...');
      const mockApiResponse = await axios.get('http://localhost:5002/api/stocks/data');
      const mockData = mockApiResponse.data[symbol];

      if (mockData) {
        res.json(mockData);
      } else {
        res.status(404).json({ message: `No historical data available for symbol ${symbol} in mock API.` });
      }
    } catch (mockError) {
      console.error('Error fetching historical data from mock API:', mockError.message);
      res.status(500).json({ message: 'Error fetching historical stock data from both Alpha Vantage and mock API.' });
    }
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
// Route to get stock data from MongoDB by symbol
// router.get('/stocks/:symbol', async (req, res) => {
//   const { symbol } = req.params;
//  console.log("in STOCK stockRoutes.js "+symbol);
//   try {
//     const data = await StockData.find({ symbol }).sort({ date: 1 }); // Sort by date ascending
//     if (data.length === 0) {
//       return res.status(404).json({ message: 'Stock data not found.' });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching stock data:', error);
//     res.status(500).json({ message: 'Error fetching stock data.' });
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
router.get('/mock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  console.log("in STOCKs stockRoutes.js " + symbol);
  
  try {
    const data = await StockData.find({ symbol }).sort({ date: 1 });
    // Sort by date ascending
    console.log(data);
    if (data.length === 0) {
      throw new Error(`No data available for symbol ${symbol}`);
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    
    // If no data is found in the database, try to return mock data
    if (mockData && mockData.stocks && Array.isArray(mockData.stocks)) {
      const mockStock = mockData.stocks.find(stock => stock.symbol === symbol);
      if (mockStock) {
        return res.json(mockStock);
      }
    }

    // If fallback also fails, send a 404 response
    res.status(404).json({ message: `No data available for symbol ${symbol}` });
  }
});

// POST route for trading stocks (buy/sell)
router.post('/trade', tradeStock);

// GET route to retrieve portfolio data-working correctly
router.get('/portfolio/Portfolio', getPortfolio);

// New route to fetch and store stock data from an external API (e.g., Alpha Vantage)
      router.post('/fetch-and-store', fetchAndStoreStockDataController);
      
      module.exports = router; 
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
              