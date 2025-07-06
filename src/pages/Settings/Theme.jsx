import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import PreviewWebsite from "../../components/PreviewWebsite";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const themesImages = [
    "theme_0",
    "theme_1",
    "theme_2",
    "theme_3",
    "theme_4",
    "theme_5",
    "theme_6",
    "theme_7",
    "theme_8",
    "theme_9",
    "theme_10",
    "theme_11",
    "theme_12",
    "theme_13",
    "theme_14",
    "theme_15",
    "theme_16",
    "theme_20",
    "theme_21",
    "theme_22",
    "theme_23",
    "theme_24",
    "theme_25",
    "theme_26",
    "theme_27",
    "theme_28",
    "theme_29",
    "theme_30",
    "theme_31",
  ];

  const getTheme = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("web-management/theme");
      if (response.data.success) {
        setSelectedTheme(response.data.data.theme.replace("-", "_"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (theme) => {
    try {
      const response = await AxiosInstance.post("/web-management/theme", {
        theme: theme.replace("_", "-"),
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
        setSelectedTheme(response.data.data.theme.replace("-", "_"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const orderedThemes = [
    selectedTheme,
    ...themesImages.filter((theme) => theme !== selectedTheme),
  ];

  useEffect(() => {
    getTheme();
  }, []);

  return (
    <>
      {loading ? (
        <Loader size="lg" center style={{ top: "400px" }} />
      ) : (
        <>
        <Breadcrumb title="Theme Website" />
        <Card className="rounded-0 shadow-sm">
        <Card.Body>
          <Row className="gx-2">
            {orderedThemes.map((theme, idx) => {
              const isActive = selectedTheme === theme ? "active" : "";
              const isHoverable = isActive ? "" : "hoverable";

              return (
                <Col key={idx} md={4}>
                  <div
                    className={`theme-item ${isActive} ${isHoverable}`}
                    onClick={() => handleThemeChange(theme)}
                    style={{
                      cursor: isActive ? "default" : "pointer",
                      position: "relative",
                      border: isActive
                        ? "3px solid rgb(35, 192, 43)"
                        : "none",
                      padding: "10px",
                      borderRadius: "5px",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <PreviewWebsite themes={theme} />

                    {!isActive && (
                      <div
                        className="hover-button"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          borderRadius: "8px",
                          zIndex: 1,
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThemeChange(theme);
                          }}
                          style={{ width: "100%" }}
                        >
                          Change Theme
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

        </>
        
      )}
    </>
  );
};

export default Theme;
