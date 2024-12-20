import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const LightweightchartLib = () => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();

  useEffect(() => {
    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 704,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#eeeeee' },
        horzLines: { color: '#eeeeee' },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#cccccc' },
      timeScale: { borderColor: '#cccccc' },
    });

    // Add a candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: 'green',
      downColor: 'red',
      borderUpColor: 'green',
      borderDownColor: 'red',
      wickUpColor: 'green',
      wickDownColor: 'red',
    });
    candleSeriesRef.current = candleSeries;

    // Add sample initial data
    candleSeries.setData([
      { time: '2024-12-14', open: 100, high: 105, low: 95, close: 102 },
      { time: '2024-12-15', open: 102, high: 108, low: 101, close: 107 },
      { time: '2024-12-16', open: 107, high: 110, low: 106, close: 109 },
      { time: '2024-12-17', open: 109, high: 112, low: 108, close: 111 },
    ]);

    // Handle cleanup
    return () => {
      chart.remove();
    };
  }, []);

  useEffect(() => {
    // Handle chart resize
    const handleResize = () => {
      const chart = chartContainerRef.current.querySelector('.tv-lightweight-charts');
      if (chart) {
        chart.resize(chartContainerRef.current.offsetWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Update chart with real-time data
    const interval = setInterval(() => {
      const now = new Date();
      candleSeriesRef.current.update({
        time: Math.floor(now.getTime() / 1000), // Convert to UNIX timestamp
        open: Math.random() * 100 + 100,
        high: Math.random() * 100 + 200,
        low: Math.random() * 100 + 50,
        close: Math.random() * 100 + 150,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default LightweightchartLib;
