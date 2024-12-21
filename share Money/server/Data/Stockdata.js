const axios = require('axios');
const StockData = require('./models/StockData');

async function fetchAndStoreStockData() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

  try {
    // Fetch the data from the API
    const response = await axios.get(url);
    const stocks = response.data;

    // Validate API response
    if (!Array.isArray(stocks)) {
      throw new Error('Unexpected API response format: Expected an array of stocks');
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    currentDate.setHours(0, 0, 0, 0); // Set to midnight to avoid timezone issues

    // Fetch existing stocks for the current date to avoid duplicates
    const existingStocks = await StockData.find({
      symbol: { $in: stocks.map(stock => stock.symbol) },
      date: currentDate,
    });

    const existingStockSymbols = existingStocks.map(stock => stock.symbol);

    // Prepare documents for stocks that do not exist in the database for the current date
    const stockDocuments = stocks.filter(stock => !existingStockSymbols.includes(stock.symbol))
      .map(stock => ({
        symbol: stock.symbol,
        date: currentDate,
        open: stock.current_price || 0,
        high: stock.high_24h || 0,
        low: stock.low_24h || 0,
        close: stock.current_price || 0,
        volume: stock.total_volumes || 0,
      }));

    // Use bulkWrite for better performance instead of multiple save calls
    const bulkOps = stockDocuments.map(doc => ({
      updateOne: {
        filter: { symbol: doc.symbol, date: doc.date },
        update: { $set: doc },
        upsert: true, // Insert if it doesn't exist
      },
    }));

    // Perform the bulkWrite operation with updateOne
    if (bulkOps.length > 0) {
      const result = await StockData.bulkWrite(bulkOps);
      console.log(`Stock data stored successfully. Inserted: ${result.nUpserted}, Updated: ${result.nModified}`);
    } else {
      console.log('No new stock data to store');
    }
  } catch (error) {
    console.error(`Error fetching or saving stock data from ${url}:`, error.message);
    throw error;
  }
}

module.exports = { fetchAndStoreStockData };
