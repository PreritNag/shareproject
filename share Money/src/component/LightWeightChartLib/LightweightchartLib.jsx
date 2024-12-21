import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

// Mock data for fallback
const mockData = [
  { time: 1672531200, open: 150, high: 155, low: 148, close: 152 },
  { time: 1672534800, open: 152, high: 158, low: 151, close: 157 },
  { time: 1672538400, open: 157, high: 160, low: 154, close: 159 },
  { time: 1672542000, open: 159, high: 162, low: 158, close: 161 },
];

const LightweightchartLib = () => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Transform data to lightweight-charts format
  const transformStockData = (data) =>
    data.map((entry) => ({
      time: new Date(entry.date).getTime() / 1000, // Convert ISO string to UNIX timestamp
      open: entry.open,
      high: entry.high,
      low: entry.low,
      close: entry.close,
    }));

  // Fetch stock data from MongoDB
  const fetchStockData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/stocks/${symbol}`);
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setMessage('');
        setStockData(transformStockData(data));
      } else {
        setMessage('No data available for the selected stock.');
        setStockData([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error.message);
      const userConfirmed = window.confirm(
        'Error fetching stock data. Would you like to display mock data instead?'
      );
      if (userConfirmed) {
        setStockData(mockData);
        setMessage('Displaying mock data.');
      } else {
        setStockData([]);
        setMessage('Stock data could not be loaded.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize the chart
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 704,
      layout: { backgroundColor: '#ffffff', textColor: '#000000' },
      grid: { vertLines: { color: '#eeeeee' }, horzLines: { color: '#eeeeee' } },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#cccccc' },
      timeScale: { borderColor: '#cccccc' },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: 'green',
      downColor: 'red',
      borderUpColor: 'green',
      borderDownColor: 'red',
      wickUpColor: 'green',
      wickDownColor: 'red',
    });
    candleSeriesRef.current = candleSeries;

    fetchStockData();

    // Resize chart on window resize
    const handleResize = () => {
      chart.resize(chartContainerRef.current.offsetWidth, 704);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  // Update the chart data
  useEffect(() => {
    if (stockData.length && candleSeriesRef.current) {
      candleSeriesRef.current.setData(stockData);
    }
  }, [stockData]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Stock Symbol: {symbol}</h2>
      <div className="mb-4">
        <button
          onClick={() => setSymbol('AAPL')}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          AAPL
        </button>
        <button
          onClick={() => setSymbol('GOOGL')}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          GOOGL
        </button>
        <button
          onClick={() => setSymbol('AMZN')}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          AMZN
        </button>
      </div>
      <div>{isLoading && <p>Loading...</p>}</div>
      <div>{message && <p className="text-red-500 mb-4">{message}</p>}</div>
      <div ref={chartContainerRef} className="w-full h-96" />
    </div>
  );
};

export default LightweightchartLib;
