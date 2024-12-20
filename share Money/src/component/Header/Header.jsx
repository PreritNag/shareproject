// import React from 'react';
// import './Header.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import logo from './capture_20241217152410783.bmp';
// const Header = () => {
//   return (
//     <>
//       <header className="header">
//         <a href="/" className="logo">
//           <img src={logo} alt="Logo" className='logo' />
//         </a>
//         <form className="search-bar" action="/search" method="GET">
//           <button type="submit" className="search-button">
//             <FontAwesomeIcon icon={faMagnifyingGlass} />
//           </button>
//           <input
//             type="text"
//             name="query"
//             placeholder="Search for articles, products, etc."
//             className="Search"
//             required
//           />
//         </form>
//         <nav className="navbarbtns">
//           <button className="navbarbtn">Invest</button>
//           <button className="navbarbtn">Feature</button>
//           <button className="navbarbtn">Pricing</button>
//           <button className="navbarbtn">Disclosure</button>
//         </nav>
//         <div className="navbarbtns">
//           <button className="navbarbtn Login">Login</button>
//         </div>
//         <div className="navbarbtns">
//           <button className="navbarbtn Login">Signup</button>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;

import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from './capture_20241217152410783.bmp';

const Header = () => {
  return (
    <>
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" className='logo' />
        </a>
        <form className="search-bar" action="/search" method="GET">
          <button type="submit" className="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <input
            type="text"
            name="query"
            placeholder="Search for articles, products, etc."
            className="Search"
            required
          />
        </form>
        <nav className="navbarbtns">
          <button className="navbarbtn">Invest</button>
          <button className="navbarbtn">Feature</button>
          <button className="navbarbtn">Pricing</button>
          <button className="navbarbtn">Disclosure</button>
        </nav>
        <div className="navbarbtns">
        <Link to="/Login"> {/* Use Link instead of a button */}
          <button className="navbarbtn Login">Login</button>
        </Link>
        </div>
        <div className="navbarbtns">
          <Link to="/Signup"> {/* Use Link instead of a button */}
            <button className="navbarbtn Login">Signup</button>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;

