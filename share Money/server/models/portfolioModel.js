const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  averageBuyPrice: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema({
  balance: { type: Number, required: true },
  stocks: [stockSchema],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
 