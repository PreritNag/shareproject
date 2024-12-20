import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header2 from '../Header2/Header2';
import AllSchearchdisplay from '../Stocksearch/AllSchearchdisplay';
import LightweightchartLib from '../LightWeightChartLib/LightweightchartLib';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "101vh" }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header2 />
        
        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflowY: 'auto' }}>
          {/* Stock Search */}
          <div className='AllScearch'>
            <AllSchearchdisplay />
          </div>
          
          {/* Chart */}
          <div className='Lightweightchart' style={{ flex: 1 }}>
            <LightweightchartLib />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
