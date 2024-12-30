import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

const LightweightchartLib = () => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define the transformStockData function
  const transformStockData = (data) => {
    return data
      .map(item => {
        if (item.time && item.open && item.high && item.low && item.close) {
          return {
            time: Math.floor(new Date(item.time).getTime() / 1000), // Ensure `time` is in seconds
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close),
          };
        } else {
          console.error('Malformed item:', item); // Log problematic items
          return null;
        }
      })
      .filter(Boolean) // Remove any `null` values
      .sort((a, b) => a.time - b.time); // Sort by time in ascending order
  }; 

  let i=0;
  // Fetch Stock Data
  const fetchStockData = async () => {
    setIsLoading(true);
    try {   
      const response = await axios.get(`http://localhost:5000/api/stocks/symbol/${symbol}`);
      console.log('Fetched data:', response.data);

      const data = response.data['Time Series (Daily)'];
      console.log('Time Series Data:', data);

      if (data) {
        setMessage('');
        const transformedData = transformStockData(data); // Use the transformStockData function
        console.log('Transformed Data:', transformedData);

        // Append new data to existing stock data (simulate real-time data)
        setStockData(prevData => {
          const updatedData = [...prevData, ...transformedData];
          // Keep only the latest 10 data points
          return updatedData.slice(-10); // Keep last 10 entries
        });
      } else {
        setMessage('No data available for the selected stock.');
        setStockData([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error.message);
      setMessage('Stock data could not be loaded. Please try again.');
      setStockData([]);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Start fetching data every second
    const intervalId = setInterval(fetchStockData, 1000); // Fetch every second

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
      chart.remove();
    };
  }, [symbol]);

  useEffect(() => {
    if (stockData.length && candleSeriesRef.current) {
      console.log('Updating chart with stock data:', stockData);
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
      {message && !isLoading && (
        <button
          onClick={fetchStockData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default LightweightchartLib;
