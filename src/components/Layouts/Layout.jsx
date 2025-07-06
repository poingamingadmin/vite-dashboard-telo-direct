import React from "react";
import Header from "./Header";
import HorizontalMenu from "./HorizontalMenu";

const Layout = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const isLoginPage = window.location.pathname === "/login";
  return (
    <div className="page-wrapper">
      {!isLoginPage && token && (
        <>
          <Header />
          <HorizontalMenu />
        </>
      )}
      <div className="body-wrapper pt-10">
        <div className="container-fluid mw-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
