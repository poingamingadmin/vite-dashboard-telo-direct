import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { Loader } from "rsuite";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const PopupSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupURL, setPopupURL] = useState("");
  const [sliderURL, setSliderURL] = useState("");
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const getDataWebsite = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/web-management/popup-slider");
      if (response.data.success) {
        setSliders(response.data.data.slider);
        setPopupURL(response.data.data.popup.popup);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupSubmit = async () => {
    setLoadingPopup(true);
    try {
      const response = await AxiosInstance.post(
        "/web-management/popup-slider/popup",
        {
          url: popupURL,
        }
      );

      if (response.data.success) {
        toast.success("Popup URL updated successfully!", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
        setPopupURL(response.data.data.popup);
      } else {
        toast.error(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating Popup.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingPopup(false);
    }
  };

  const handleSliderSubmit = async () => {
    if (!sliderURL) {
      toast.error("Please enter a valid Slider CDN URL.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    setLoadingSlider(true);
    try {
      const response = await AxiosInstance.post(
        "/web-management/popup-slider/slider",
        {
          url: sliderURL,
        }
      );

      if (response.data.success) {
        setSliders((prevSliders) => [response.data.data, ...prevSliders]);
        setSliderURL("");
        toast.success("Slider URL added successfully!", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      } else {
        toast.error(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding Slider.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingSlider(false);
    }
  };

  const handleDeleteSlider = async (e, id) => {
    e.preventDefault(); // Menghentikan aksi default yang menyebabkan refresh halaman

    try {
      const response = await AxiosInstance.delete(
        `/web-management/popup-slider/slider/${id}`
      );
      if (response.data.success) {
        toast.success("Slider deleted successfully.", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
        setSliders((prevSliders) =>
          prevSliders.filter((slider) => slider.id !== id)
        );
      } else {
        toast.error(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting Slider.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getDataWebsite();
  }, []);

  return (
    <>
      {loading ? (
        <Loader size="lg" center style={{ top: "400px" }} />
      ) : (
        <>
        <Breadcrumb title="Popup & Sliders" />
        <Row className="gx-2">
          <Col md={5}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Popup</span>
              </Card.Header>
              <Card.Body>
                <Form>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Enter Popup CDN URL"
                      aria-label="Popup CDN URL"
                      aria-describedby="button-addon"
                      value={popupURL || ""}
                      onChange={(e) => setPopupURL(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      className="rounded-end-2"
                      id="button-addon"
                      onClick={handlePopupSubmit}
                      disabled={loadingPopup}
                    >
                      {loadingPopup ? "Submitting..." : "Submit"}
                    </Button>
                  </InputGroup>
                </Form>
                {popupURL ? (
                  <img src={popupURL} className="img-fluid mb-3 rounded-1" />
                ) : (
                  <Alert className="mt-3 text-center" variant="danger">
                    Popup not set
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={7}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Sliders</span>
              </Card.Header>
              <Card.Body>
                <Form>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Enter Slider CDN URL"
                      aria-label="Slider CDN URL"
                      aria-describedby="button-addon"
                      value={sliderURL || ""}
                      onChange={(e) => setSliderURL(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      className="rounded-end-2"
                      id="button-addon"
                      onClick={handleSliderSubmit}
                      disabled={loadingSlider}
                    >
                      {loadingSlider ? "Submitting..." : "Add Slider"}
                    </Button>
                  </InputGroup>
                  <Table
                    responsive
                    style={{ width: "100%" }}
                    className="text-nowrap align-middle"
                  >
                    <tbody>
                      {sliders.length > 0 ? (
                        sliders.map((dta, idx) => (
                          <tr key={idx}>
                            <td
                              className="text-center"
                              style={{ width: "10%" }}
                            >
                              {idx + 1}
                            </td>
                            <td>
                              <img
                                src={dta.image}
                                alt={`slider-item-${idx}`}
                                className="img-fluid rounded-1"
                              />
                            </td>
                            <td>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="trash-tooltip">Delete</Tooltip>
                                }
                              >
                                <button
                                  className="btn btn-danger rounded-5"
                                  onClick={(e) => handleDeleteSlider(e, dta.id)}
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td rowSpan={3} className="text-center">
                            No sliders available at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </>
      )}
    </>
  );
};

export default PopupSlider;
