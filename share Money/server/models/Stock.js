const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  stockSymbol: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  openPrice: {
    type: Number,
    required: true
  },
  closePrice: {
    type: Number,
    required: true
  },
  highPrice: {
    type: Number,
    required: true
  },
  lowPrice: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
