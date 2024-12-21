const axios = require("axios");

// Alpha Vantage API key
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Fake data for testing
const fakeStockData = {
  symbol: 'FAKE',
  time: '2024-12-20 16:00:00',  // Fake timestamp
  openPrice: 150.25,
  highPrice: 152.30,
  lowPrice: 149.50,
  closePrice: 151.00,
  volume: 1000000,
};

const fakeHistoricalStockData = {
  symbol: 'FAKE',
  date: '2024-12-19',  // Fake date
  openPrice: 145.50,
  highPrice: 147.00,
  lowPrice: 144.00,
  closePrice: 146.50,
  volume: 2000000,
};

// Function to get real-time stock data from Alpha Vantage
const getStockData = async (symbol, date, interval = '1min') => {
  try {
    // Fetch stock data from Alpha Vantage API
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: interval,
        apikey: API_KEY,
      },
    });

    // Check if the response has the required data
    const timeSeries = response.data['Time Series (Intraday)'];
    if (!timeSeries) {
      throw new Error(`No data available for symbol ${symbol} on ${date}`);
    }

    // Format the date to match the Alpha Vantage timestamp format (e.g., "2024-12-21 09:30:00")
    const formattedDate = new Date(date).toISOString();
    
    // Get the closest timestamp to the given date
    const closestTime = Object.keys(timeSeries).find((time) =>
      time.startsWith(formattedDate.substring(0, 10)) // Compare only date (ignoring time part)
    );

    if (!closestTime) {
      throw new Error(`No stock data found for symbol ${symbol} on ${formattedDate}`);
    }

    const latestData = timeSeries[closestTime];
    return {
      stockSymbol: symbol,
      date: new Date(closestTime),
      openPrice: parseFloat(latestData['1. open']),
      closePrice: parseFloat(latestData['4. close']),
      highPrice: parseFloat(latestData['2. high']),
      lowPrice: parseFloat(latestData['3. low']),
      volume: parseInt(latestData['5. volume']),
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol} on ${date}: ${error.message}`);
    throw error;
  }
};
// Function to get historical daily stock data from Alpha Vantage
const getHistoricalStockData = async (symbol) => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
      }
    });

    // Check if we hit the rate limit
    if (response.data.Note) {
      console.error('API rate limit exceeded, using fake data.');
      return fakeHistoricalStockData;  // Return fake data if rate limit is exceeded
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      console.error(`Error: No daily data found for symbol ${symbol}`);
      return fakeHistoricalStockData;  // Return fake data if no data is found
    }

    // Extract the most recent stock data (latest entry in the time series)
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    // Structure the data in a more convenient format
    const stockInfo = {
      symbol: symbol,
      date: latestDate,
      openPrice: parseFloat(latestData['1. open']),
      highPrice: parseFloat(latestData['2. high']),
      lowPrice: parseFloat(latestData['3. low']),
      closePrice: parseFloat(latestData['4. close']),
      volume: parseInt(latestData['5. volume']),
    };

    return stockInfo;
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return fakeHistoricalStockData;  // Return fake data in case of error
  }
};

module.exports = { getStockData, getHistoricalStockData }; // Export both functions
