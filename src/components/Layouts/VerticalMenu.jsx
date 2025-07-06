import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import "./Menu.css";

function VerticalMenu() {
  const [isOpen, setIsOpen] = useState(false); // Status menu terbuka atau tertutup
  const [menuData, setMenuData] = useState([]); // Data menu dari localStorage
  const menuRef = useRef(null); // Referensi elemen menu

  // Fungsi untuk toggle menu utama
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi untuk menutup menu utama
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Menutup menu jika klik di luar elemen menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenu();
    }
  };

  // Memuat data menu dari localStorage dan meratakan menu
  useEffect(() => {
    const menu = localStorage.getItem("auth_menu");
    if (menu) {
      const parsedMenu = JSON.parse(menu);

      // Meratakan menu utama dan child menu menjadi satu level
      const flatMenu = parsedMenu.reduce((acc, menu) => {
        acc.push(menu);
        if (menu.children && menu.children.length > 0) {
          acc.push(...menu.children);
        }
        return acc;
      }, []);

      setMenuData(flatMenu);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        onClick={toggleMenu}
        style={{ fontSize: "24px", cursor: "pointer" }}
        className="menu-toggle ms-3"
      >
        <IoMenu color="white" />
      </div>
      {isOpen && <div className="backdrop" onClick={closeMenu}></div>}

      <div className={`menu ${isOpen ? "open" : ""}`} ref={menuRef}>
        <ul>
          {menuData.length > 0 ? (
            menuData.map((menu, index) => (
              <li key={index} className="menu-item">
                <Link
                  to={menu.link ? menu.link : "#"}
                  onClick={closeMenu}
                  className="menu-link"
                >
                  {menu.title || "Untitled"}
                </Link>
              </li>
            ))
          ) : null}
        </ul>
      </div>
    </div>
  );
}

export default VerticalMenu;
