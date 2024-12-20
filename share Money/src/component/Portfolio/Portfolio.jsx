import React, { useEffect, useState } from 'react';
import './Portfolio.css';

const Portfolio = () => {
    const [balance, setBalance] = useState(1000); // Initial balance
    const [assets, setAssets] = useState([]); // List of user's assets

    // Example: Add a stock to the portfolio (for testing/demo purposes)
    useEffect(() => {
        const initialAssets = [
            { symbol: 'AAPL', quantity: 10, currentPrice: 150 },
            { symbol: 'GOOGL', quantity: 5, currentPrice: 2800 },
            { symbol: 'GOOG', quantity: 5, currentPrice: 2800 },
            { symbol: 'GOGL', quantity: 5, currentPrice: 2800 },
            { symbol: 'GGL', quantity: 5, currentPrice: 2800 },
        ];
        setAssets(initialAssets);
    }, []);

    // Calculate total value of assets
    const totalAssetValue = assets.reduce((total, asset) => {
        return total + asset.quantity * asset.currentPrice;
    }, 0);

    return (
        <div className="Portfolio">
            <h1>Portfolio</h1>
            
            {/* Balance Section */}
            <div className="Balance">
                <h2>Available Balance</h2>
                <h1>${balance.toFixed(2)}</h1>
            </div>

            {/* Assets Section */}
            <div className="Assets">
                <h2>My Assets</h2>
                {assets.length === 0 ? (
                    <p>No assets yet. Start trading!</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Current Price</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset, index) => (
                                <tr key={index}>
                                    <td>{asset.symbol}</td>
                                    <td>{asset.quantity}</td>
                                    <td>${asset.currentPrice.toFixed(2)}</td>
                                    <td>${(asset.quantity * asset.currentPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Total Portfolio Value */}
            <div className="TotalValue">
                <h2>Total Portfolio Value</h2>
                <h1>${(balance + totalAssetValue).toFixed(2)}</h1>
            </div>
        </div>
    );
};

export default Portfolio;
