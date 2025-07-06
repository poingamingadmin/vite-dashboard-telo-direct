import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import AxiosInstance from "../../components/Api/AxiosInstance";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const APIManagement = () => {
  const [dataApi, setDataApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingBtnAPI, setLoadingBtnAPI] = useState(false);
  const [loadingBtnBal, setLoadingBtnBal] = useState(false);
  const [formData, setFormData] = useState({
    agent_code: "",
    agent_token: "",
    api_url: "",
  });

  const getDataApi = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/web-management/api");
      if (response.data.success) {
        setDataApi(response.data.data);
        setFormData({
          agent_code: response.data.data.agent_code,
          agent_token: response.data.data.agent_token,
          api_url: response.data.data.api_url,
        });
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoadingBtnAPI(true);
    try {
      const response = await AxiosInstance.put("/web-management/api", formData);
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
        setDataApi(response.data.data);
        if (response.data) {
          updateAuthAdminInLocalStorage(
            response.data.data.agent_code,
            response.data.data.agent_token
          );
        }
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingBtnAPI(false);
    }
  };

  const resetBalance = async () => {
    setLoadingBtnBal(true);
    try {
      const response = await AxiosInstance.get(
        "/web-management/reset-user-balance",
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingBtnBal(false);
    }
  };

  const updateAuthAdminInLocalStorage = (newAgentCode, newAgentToken) => {
    const authAdmin = JSON.parse(localStorage.getItem("auth_admin"));

    if (authAdmin) {
      authAdmin.agent_code = newAgentCode;
      authAdmin.agent_token = newAgentToken;
      localStorage.setItem("auth_admin", JSON.stringify(authAdmin));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetWebsite = async () => {
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.post(
        "/web-management/refreshMigration"
      );
      toast.success(response.data.message, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error resetting website:", error);
    } finally {
      setShowModal(false);
      setLoadingBtn(false);
    }
  };

  useEffect(() => {
    getDataApi();
  }, []);

  return loading ? (
    <Loader size="lg" center style={{ top: "400px" }} />
  ) : (
    <>
    <Breadcrumb title="API Games" />
      <Row className="gx-2">
        <Col md={6}>
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
              <span className="fs-4 text-white">API</span>
            </Card.Header>
            <Form>
              <Card.Body>
                <Form.Label>Agent Code</Form.Label>
                <Form.Control
                  name="agent_code"
                  value={formData.agent_code || ""}
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <Form.Label>Agent Token</Form.Label>
                <Form.Control
                  name="agent_token"
                  value={formData.agent_token || ""}
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <Form.Label>API Url</Form.Label>
                <Form.Control
                  name="api_url"
                  value={formData.api_url || ""}
                  onChange={handleInputChange}
                  className="mb-3"
                />
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  disabled={loadingBtnAPI}
                  className="rounded-2"
                >
                  {loadingBtnAPI ? "Updating..." : "Save Changes"}
                </Button>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
              <span className="fs-4 text-white">Tools</span>
            </Card.Header>
            <Card.Body>
              <Button
                variant="dark"
                onClick={resetBalance}
                className="rounded-2 w-100 mb-3"
                disabled={loadingBtnBal}
              >
                {loadingBtnBal ? "Processing.." : "Reset User Balance"}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowModal(true)}
                className="rounded-2 w-100"
              >
                Reset Website
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ModalConfirm
        isTextInputRequired={true}
        textInfo={{
          itemName: (
            <span className="text-danger fw-semibold">
              All user data will be permanently deleted from
            </span>
          ),
          item: <span className="text-primary fw-semibold">this website</span>,
          type: "delete"
        }}
        onShow={showModal}
        onHide={() => setShowModal(false)}
        handleConfirm={resetWebsite}
        btnLoading={loadingBtn}
      />
    </>
  );
};

export default APIManagement;
