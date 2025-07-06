import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AxiosInstance from "../Api/AxiosInstance";

const HorizontalMenu = () => {
  const [activeMenus, setActiveMenus] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const location = useLocation();

  const toggleMenu = (menuLink) => {
    setActiveMenus((prev) =>
      prev.includes(menuLink)
        ? prev.filter((item) => item !== menuLink)
        : [...prev, menuLink]
    );
  };

  const isActive = (menuLink) => {
    
    return (
      location.pathname === menuLink ||
      location.pathname.startsWith(menuLink)
    );
  };

  const isParentActive = (menu) => {
    if (menu.children && menu.children.length > 0) {
      return menu.children.some(
        (child) =>
          location.pathname === child.link ||
          location.pathname.startsWith(child.link)
      );
    }
    return false;
  };

  useEffect(() => {
    const menu = localStorage.getItem("auth_menu");
    setMenuData(menu ? JSON.parse(menu) : []);
  }, []);
  

  return (
    <aside className="left-sidebar with-horizontal">
      <div>
        <nav className="sidebar-nav scroll-sidebar container-fluid mw-100">
          <ul id="sidebarnav">
            {menuData && menuData.length > 0 ? (
              menuData.map((menu, index) => (
                
                <li key={index} className="sidebar-item">
                  <Link
                    className={`sidebar-link ${
                      isActive(menu.link) || isParentActive(menu) ? "active" : ""
                    }`}
                    to={menu.link}
                    onClick={(e) => {
                      if (menu.children && menu.children.length > 0) {
                        e.preventDefault();
                        toggleMenu(menu.link);
                      }
                    }}
                    aria-expanded={
                      activeMenus.includes(menu.link) ? "true" : "false"
                    }
                  >
                    <span className="hide-menu">{menu.title || "Untitled"}</span>
                  </Link>

                  {menu.children && menu.children.length > 0 && (
                    <ul
                      className={`collapse first-level rounded-0 shadow-sm ${
                        activeMenus.includes(menu.link) ? "show" : ""
                      }`}
                      aria-expanded={
                        activeMenus.includes(menu.link) ? "true" : "false"
                      }
                    >
                      {menu.children.map((child, childIndex) => (
                        <li key={childIndex} className="sidebar-item">
                          <Link
                            to={child.link}
                            className={`sidebar-link ${
                              location.pathname === `/${child.link}`
                                ? "active-child"
                                : ""
                            }`}
                            aria-label={child.title}
                          >
                            <span className="hide-menu">
                              {child.title || "Untitled"}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))
            ) : (
              <li className="sidebar-item">
                <span>No menu items available</span>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default HorizontalMenu;
