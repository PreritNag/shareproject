const Stock = require('../models/Stock');
const axios = require('axios');

// Fetch stock data for a specific symbol and date
const getStockData = async (symbol, date) => {
  try {
    console.log(`Fetching stock data for symbol: ${symbol} on date: ${date}`);
    
    // Ensure date is in the correct format (YYYY-MM-DD)
    const formattedDate = new Date(date);
    if (isNaN(formattedDate)) {
      throw new Error('Invalid date format');
    }

    // Set the time to midnight for the start of the day (local timezone)
    const startOfDay = new Date(formattedDate);
    startOfDay.setHours(0, 0, 0, 0); // Start of the given date (midnight)

    // Set the time to the last moment of the day (11:59:59.999 PM)
    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999); // End of the given date (end of the day)

    console.log(`Formatted start of day: ${startOfDay.toISOString()}`);
    console.log(`Formatted end of day: ${endOfDay.toISOString()}`);

    // Query the database to find stock data for the given symbol and date
    const stock = await Stock.findOne({
      stockSymbol: symbol,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!stock) {
      console.log(`No stock data found in DB for symbol: ${symbol} on ${date}`);
      return null;
    }

    console.log(`Stock data found in DB for ${symbol}:`, stock);
    return stock;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol} on ${date}:`, error.message);
    throw new Error(`Error fetching stock data for ${symbol} on ${date}: ${error.message}`);
  }
};

// Fetch stock data from an external source (e.g., Alpha Vantage)
// const fetchExternalStockData = async (symbol, date) => {
//   const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
//   try {
//     const response = await axios.get('https://www.alphavantage.co/query', {
//       params: {
//         function: 'TIME_SERIES_DAILY',
//         symbol: symbol,
//         apikey: API_KEY
//       }
//     });

//     const timeSeries = response.data['Time Series (Daily)'];
//     const lastRefreshed = response.data['Meta Data']['3. Last Refreshed'];

//     // Check if data for the requested date exists
//     if (!timeSeries || !timeSeries[date]) {
//       console.log(`No data found for ${symbol} on ${date}. Last refreshed: ${lastRefreshed}`);

//       // If the requested date is not available, fall back to the most recent available date
//       const availableDates = Object.keys(timeSeries);
//       const mostRecentDate = availableDates[0]; // The most recent date will be the first key

//       console.log(`Falling back to the most recent available data for ${symbol} on ${mostRecentDate}`);

//       // Use the data for the most recent date
//       const dailyData = timeSeries[mostRecentDate];

//       const stockData = {
//         stockSymbol: symbol,
//         date: new Date(mostRecentDate),
//         openPrice: parseFloat(dailyData['1. open']),
//         closePrice: parseFloat(dailyData['4. close']),
//         highPrice: parseFloat(dailyData['2. high']),
//         lowPrice: parseFloat(dailyData['3. low']),
//         volume: parseInt(dailyData['5. volume']),
//       };

//       console.log('Fetched stock data:', stockData);

//       return stockData;
//     }

//     // If data for the requested date is found, use it
//     const dailyData = timeSeries[date];

//     const stockData = {
//       stockSymbol: symbol,
//       date: new Date(date),
//       openPrice: parseFloat(dailyData['1. open']),
//       closePrice: parseFloat(dailyData['4. close']),
//       highPrice: parseFloat(dailyData['2. high']),
//       lowPrice: parseFloat(dailyData['3. low']),
//       volume: parseInt(dailyData['5. volume']),
//     };

//     console.log('Fetched stock data:', stockData);

//     return stockData;
//   } catch (error) {
//     console.error(`Error fetching external stock data for ${symbol} on ${date}:`, error.message);
//     throw error;
//   }
// };


// // Store stock data in the database
const fetchExternalStockData = async (symbol, date) => {
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  
  try {
    // First, attempt to fetch from Alpha Vantage
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    const timeSeries = response.data['Time Series (Daily)'];
    const lastRefreshed = response.data['Meta Data']['3. Last Refreshed'];
    
    // Check if data for the requested date exists
    if (!timeSeries || !timeSeries[date]) {
      console.log(`No data found for ${symbol} on ${date}. Last refreshed: ${lastRefreshed}`);
      
      // If the requested date is not available, fall back to the most recent available date
      const availableDates = Object.keys(timeSeries);
      const mostRecentDate = availableDates[0]; // The most recent date will be the first key
      
      console.log(`Falling back to the most recent available data for ${symbol} on ${mostRecentDate}`);
      
      // Use the data for the most recent date
      const dailyData = timeSeries[mostRecentDate];
      
      const stockData = {
        stockSymbol: symbol,
        date: new Date(mostRecentDate),
        openPrice: parseFloat(dailyData['1. open']),
        closePrice: parseFloat(dailyData['4. close']),
        highPrice: parseFloat(dailyData['2. high']),
        lowPrice: parseFloat(dailyData['3. low']),
        volume: parseInt(dailyData['5. volume']),
      };
      
      console.log('Fetched stock data:', stockData);
      
      return stockData;
    }
    
    // If data for the requested date is found, use it
    const dailyData = timeSeries[date];
    
    const stockData = {
      stockSymbol: symbol,
      date: new Date(date),
      openPrice: parseFloat(dailyData['1. open']),
      closePrice: parseFloat(dailyData['4. close']),
      highPrice: parseFloat(dailyData['2. high']),
      lowPrice: parseFloat(dailyData['3. low']),
      volume: parseInt(dailyData['5. volume']),
    };
    
    console.log('Fetched stock data:', stockData);
    
    return stockData;
  } catch (error) {
    console.error(`Error fetching external stock data from Alpha Vantage for ${symbol} on ${date}:`, error.message);
    console.log('Falling back to mock API...');
    
    // If Alpha Vantage fails, fall back to mock API
    try {
      const response = await axios.get('http://localhost:5002/api/stocks/data', {
        params: {
          symbol: symbol,
          date: date
        }
      });
      
      if (response.data && response.data.stockData) {
        const stockData = response.data.stockData;
        console.log('Fetched stock data from mock API:', stockData);
        return stockData;
      } else {
        throw new Error('No stock data returned from mock API');
      }
    } catch (mockApiError) {
      console.error('Error fetching data from mock API:', mockApiError.message);
      throw new Error('Failed to fetch stock data from both Alpha Vantage and mock API');
    }
  }
};

const storeStockData = async (data) => {
  try {
    // Validate required fields
    const { stockSymbol, date, openPrice, closePrice, highPrice, lowPrice, volume } = data;
    if (!stockSymbol || !date || !openPrice || !closePrice || !highPrice || !lowPrice || !volume) {
      throw new Error('Missing required fields in stock data');
    }

    // Check if data already exists
    const existingStock = await Stock.findOne({ stockSymbol: stockSymbol, date: new Date(date) });
    if (existingStock) {
      throw new Error(`Stock data already exists for symbol: ${stockSymbol} on ${date}`);
    }

    const stockData = new Stock(data);
    await stockData.save();
    return { message: 'Stock data saved successfully' };
  } catch (error) {
    throw new Error(`Error saving stock data: ${error.message}`);
  }
};
// Fetch and store stock data, checking if it exists in DB, else fetch from external source
const fetchAndStoreStockData = async (symbol, date) => {
  try {
    // First, check if stock data exists in the database
    let stockData = await getStockData(symbol, date);

    if (!stockData) {
      // If not found in DB, fetch from external source (like Alpha Vantage)
      console.log(`Stock data not found for ${symbol} on ${date}, fetching from Alpha Vantage...`);

      // Fetch stock data from external API (e.g., Alpha Vantage or other sources)
      stockData = await fetchExternalStockData(symbol, date);

      // Store the fetched data in the database
      await storeStockData(stockData);
      console.log(`Stock data for ${symbol} on ${date} saved successfully from external source!`);
    } else {
      console.log(`Stock data for ${symbol} on ${date} already exists in the database.`);
    }
  } catch (error) {
    console.error(`Failed to fetch or store stock data for ${symbol} on ${date}:`, error.message);
  }
};

module.exports = { getStockData, storeStockData, fetchAndStoreStockData };
