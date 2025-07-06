import { Nav } from "react-bootstrap";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import { useState } from "react";
import SocialMedia from "./SocialMedia";
import Promotion from "./Promotion";
import APIManagement from "./APIManagement";
import PopupSlider from "./PopupSlider";
import SeoManagement from "./SeoManagement";
import Theme from "./Theme";
import General from "./General";

const WebManagement = () => {
  const [menu, setMenu] = useState("General");

  const renderContent = () => {
    switch (menu) {
      case "SocialMedia":
        return <SocialMedia />;
      case "Promotion":
        return <Promotion />;
      case "PopupSlider":
        return <PopupSlider />;
      case "SeoManagement":
        return <SeoManagement />;
      case "Theme":
        return <Theme />;
      case "API":
        return <APIManagement />;
      default:
        return <General />;
    }
  };

  return (
    <>
      <Breadcrumb title="Web Management" />
      <Nav
        variant="pills"
        className="mb-3 nav-scrollable"
        activeKey={menu}
        onSelect={(selectedKey) => setMenu(selectedKey)} // Update state when a tab is clicked
      >
        <Nav.Item>
          <Nav.Link eventKey="General" className="rounded-2 fw-semibold fs-3">
            General
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="SocialMedia"
            className="rounded-2 fw-semibold fs-3"
          >
            Social Media
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="PopupSlider"
            className="rounded-2 fw-semibold fs-3"
          >
            Popup & Sliders
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Promotion" className="rounded-2 fw-semibold fs-3">
            Promotion Pages
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="SeoManagement"
            className="rounded-2 fw-semibold fs-3"
          >
            Seo Management
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Theme" className="rounded-2 fw-semibold fs-3">
            Theme Website
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="API" className="rounded-2 fw-semibold fs-3">
            API
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {renderContent()}
    </>
  );
};

export default WebManagement;
