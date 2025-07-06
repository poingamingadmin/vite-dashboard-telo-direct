import React from "react";
import { Dropdown } from "rsuite";
import { FaPowerOff, FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import "rsuite/Dropdown/styles/index.css";
import { Link } from "react-router-dom";

const renderUserIcon = (props, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      style={{ fontSize: "24px", cursor: "pointer" }}
      className="me-4"
    >
      <FaUserCircle color="white" />
    </div>
  );
};

const UserDropdown = ({ logout }) => {
  return (
    <Dropdown
      renderToggle={renderUserIcon}
      menuStyle={{
        top: "53px",
        width: "200px",
        right: "-13px",
        borderRadius: 2,
      }}
      placement="leftStart"
      noCaret
    >
      <Dropdown.Item as={Link} to="/profile" icon={<FaGear className="me-1" />}>
        Profile
      </Dropdown.Item>
      <Dropdown.Item onClick={logout} icon={<FaPowerOff className="me-1" />}>
        Logout
      </Dropdown.Item>
    </Dropdown>
  );
};

export default UserDropdown;
