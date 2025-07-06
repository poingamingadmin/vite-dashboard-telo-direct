import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const General = () => {
  const [data, setData] = useState({
    site_name: "",
    site_title: "",
    site_logo: "",
    favicon: "",
    marquee: "",
    proggressive_img: "",
    unique_code: "",
    min_deposit: "",
    max_deposit: "",
    min_withdrawal: "",
    is_maintenance: false,
    max_withdrawal: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingBtn2, setLoadingBtn2] = useState(false);

  const getDataWebsite = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/web-management/general");
      if (response.data.success) {
        setData({
          ...response.data.data,
          min_deposit: String(response.data.data.min_deposit),
          max_deposit: String(response.data.data.max_deposit),
          min_withdrawal: String(response.data.data.min_withdrawal),
          max_withdrawal: String(response.data.data.max_withdrawal),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumberForDisplay = (value) => {
    if (!value) return "";
    const cleanValue = value.replace(/[^\d]/g, "");
    if (cleanValue === "") return "";
    return parseInt(cleanValue, 10).toLocaleString();
  };

  const cleanNumberForSave = (value) => {
    return value.replace(/[^\d.-]/g, "");
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = value === "true" ? true : value === "false" ? false : value;

    setData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };


  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = cleanNumberForSave(value);
    setData((prevData) => ({
      ...prevData,
      [name]: cleanedValue,
    }));
  };

  const showToast = (type, message) => {
    const toastConfig = {
      position: "bottom-center",
      autoClose: 5000,
      limit: 3,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };

    if (type === "success") {
      toast.success(message, toastConfig);
    } else {
      toast.error(message, toastConfig);
    }
  };

  const updateAuthAdminInLocalStorage = (newLogo) => {
    const authAdmin = JSON.parse(localStorage.getItem("auth_admin"));

    if (authAdmin) {
      authAdmin.logo = newLogo;
      localStorage.setItem("auth_admin", JSON.stringify(authAdmin));
    }
  };

  const handleSubmitWebsite = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);

    const websiteData = {
      site_name: data.site_name,
      site_title: data.site_title,
      site_logo: data.site_logo,
      favicon: data.favicon,
      marquee: data.marquee,
      is_maintenance: data.is_maintenance === "true" || data.is_maintenance === true,
      proggressive_img: data.proggressive_img,
    };


    try {
      const response = await AxiosInstance.post(
        "/web-management/general/website",
        websiteData
      );

      if (response.data.success) {
        updateAuthAdminInLocalStorage(websiteData.site_logo);
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error("Error updating website:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating website settings.";
      showToast("error", errorMessage);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setLoadingBtn2(true);

    const transactionData = {
      unique_code: data.unique_code,
      min_deposit: cleanNumberForSave(data.min_deposit),
      max_deposit: cleanNumberForSave(data.max_deposit),
      min_withdrawal: cleanNumberForSave(data.min_withdrawal),
      max_withdrawal: cleanNumberForSave(data.max_withdrawal),
    };

    try {
      const response = await AxiosInstance.post(
        "/web-management/general/transaction",
        transactionData
      );

      if (response.data.success) {
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error("Error updating transaction rules:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating transaction rules.";
      showToast("error", errorMessage);
    } finally {
      setLoadingBtn2(false);
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
          <Breadcrumb title="General" />
          <Row className="gx-2">
            <Col md={7}>
              <Card className="rounded-0 shadow-sm">
                <Form onSubmit={handleSubmitWebsite}>
                  <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                    <span className="fs-4 text-white">Website</span>
                  </Card.Header>
                  <Card.Body>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={data.is_maintenance ? "true" : "false"}
                      onChange={handleTextChange}
                      className={`mb-3 fw-semibold text-white ${data.is_maintenance == true ? "bg-danger" : "bg-success"}`}
                      name="is_maintenance"
                    >
                      <option value="false">RUNNING</option>
                      <option value="true">INACTIVE</option>
                    </Form.Select>

                    <Form.Label>Site Name</Form.Label>
                    <Form.Control
                      value={data.site_name || ""}
                      onChange={handleTextChange}
                      className="mb-3"
                      name="site_name"
                    />

                    <Form.Label>Site Title</Form.Label>
                    <Form.Control
                      value={data.site_title || ""}
                      onChange={handleTextChange}
                      className="mb-3"
                      name="site_title"
                    />

                    <Form.Label>Logo (CDN URL)</Form.Label>
                    <Form.Control
                      value={data.site_logo || ""}
                      onChange={handleTextChange}
                      className="mb-3"
                      name="site_logo"
                    />

                    <Form.Label>FavIcon (CDN URL)</Form.Label>
                    <Form.Control
                      value={data.favicon || ""}
                      onChange={handleTextChange}
                      className="mb-3"
                      name="favicon"
                    />

                    <Form.Label>Marquee</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="mb-3"
                      name="marquee"
                      value={data.marquee || ""}
                      onChange={handleTextChange}
                    />

                    <Form.Label>Progressive Image (CDN URL)</Form.Label>
                    <Form.Control
                      value={data.proggressive_img || ""}
                      onChange={handleTextChange}
                      className="mb-5"
                      name="proggressive_img"
                    />
                    <Button
                      variant="primary"
                      className="rounded-1"
                      type="submit"
                      disabled={loadingBtn}
                    >
                      {loadingBtn ? "Saving..." : "Save Website Changes"}
                    </Button>
                  </Card.Body>
                </Form>
              </Card>
            </Col>

            <Col md={5}>
              <Card className="rounded-0 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                  <span className="fs-4 text-white">Transaction Rules</span>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmitTransaction}>
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      value={data.unique_code || ""}
                      onChange={handleTextChange}
                      className="mb-3"
                      name="unique_code"
                    />

                    <Form.Label>Minimal Deposit</Form.Label>
                    <Form.Control
                      value={formatNumberForDisplay(data.min_deposit)}
                      onChange={handleNumberChange}
                      className="mb-3"
                      name="min_deposit"
                    />

                    <Form.Label>Maximal Deposit</Form.Label>
                    <Form.Control
                      value={formatNumberForDisplay(data.max_deposit)}
                      onChange={handleNumberChange}
                      className="mb-3"
                      name="max_deposit"
                    />

                    <Form.Label>Minimal Withdraw</Form.Label>
                    <Form.Control
                      value={formatNumberForDisplay(data.min_withdrawal)}
                      onChange={handleNumberChange}
                      className="mb-3"
                      name="min_withdrawal"
                    />

                    <Form.Label>Maximal Withdraw</Form.Label>
                    <Form.Control
                      value={formatNumberForDisplay(data.max_withdrawal)}
                      onChange={handleNumberChange}
                      className="mb-5"
                      name="max_withdrawal"
                    />

                    <Button variant="primary" type="submit" className="rounded-1">
                      {loadingBtn2 ? "Saving..." : "Save Transaction Rules"}
                    </Button>
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

export default General;
