import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClipboard, 
  faChartLine, 
  faQuestionCircle, 
  faInbox, 
  faWallet, 
  faNewspaper, 
  faChartPie, 
  faSignOutAlt,
  faUser,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "WATCHLIST", icon: faClipboard  },
    { title: "STOCK", icon: faChartLine },
    { title: "F&Q", icon: faQuestionCircle },
    { title: "IPO", icon: faInbox },
    { title: "WALLET", icon: faWallet },
    { title: "NEWS", icon: faNewspaper },
    { title: "P&L", icon: faChartPie },
    { title: "LOGOUT", icon: faSignOutAlt },
  ];

  return (
    <div className="Sidebar">
      <div className={`container ${open ? "open" : "closed"}`}>
        {/* FontAwesomeIcon for the toggler */}
        <div onClick={() => setOpen(!open)} className="image">
          <FontAwesomeIcon icon={faChevronRight} color="white" />
        </div>

        <div className="profile">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <h1 className={`name ${open ? "" : "scale-0"}`}>Prerit Nag</h1>
        </div>

        <ul className="menu">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`li-style ${index === 0 ? "li-active" : ""}`}
            >
              {/* Use FontAwesomeIcon for each menu item */}
              <FontAwesomeIcon icon={Menu.icon} className="menu-icon" />
              <span className={`${open ? "li-text" : "li-hidden"}`}>{Menu.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
