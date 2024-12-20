import React, { useState } from "react";
import Outlet from "./component/Outlet/Outlet";  // Assuming Outlet is a page
import Outlet2 from "./component/Outlet/Outlet2";  // Assuming Outlet2 is another page

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);  // Keep track of the current page

  const handleScroll = (e) => {
    if (e.deltaY < 0 && currentPage > 0) {
      setCurrentPage(prev => prev - 1);  // Scroll up
    } else if (e.deltaY > 0 && currentPage < 1) {
      setCurrentPage(prev => prev + 1);  // Scroll down
    }
  };

  return (
    <div
      onWheel={handleScroll}
      style={{
        overflow: "hidden",
        height: "100vh",
        transition: "transform 0.5s ease",
        transform: `translateY(-${currentPage * 100}vh)`,  // Smooth scrolling effect
      }}
    >
      {currentPage === 0 ? <Outlet /> : <Outlet2 />}  {/* Conditionally render Outlet or Outlet2 */}
    </div>
  );
};

export default App;
