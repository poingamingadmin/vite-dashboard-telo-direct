import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Breadcrumb = ({ title, totalData }) => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-2 mb-md-0">{title} {totalData ? `(${totalData.toLocaleString()})` : null}</h4>
        <nav aria-label="breadcrumb" className="d-flex align-items-center">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a className="text-primary text-decoration-none" href="/">
                Dashboard
              </a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              {title} 
            </li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default Breadcrumb;
