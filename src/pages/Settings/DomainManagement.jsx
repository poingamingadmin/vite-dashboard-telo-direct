import { Accordion, Form, Button, Card } from "react-bootstrap";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useEffect, useState } from "react";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import ModalConfirm from "../../components/Modals/ModalConfirm";

const DomainManagement = () => {
  const [data, setData] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});
  const [scriptMeta, setScriptMeta] = useState("");
  const [newDomain, setNewDomain] = useState({
    name: "",
    custom_title: "",
    meta_tag: `<meta name="robots" content="noindex,nofollow" />`,
  });

  const [isAddingDomain, setIsAddingDomain] = useState(false);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("/web-management/domain");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveFormData = async (e, itemId) => {
    e.preventDefault();
    setBtnLoading((prev) => ({ ...prev, [itemId]: "script_body" }));

    try {
      const domainToUpdate = data.find((item) => item.id === itemId);

      if (!domainToUpdate) {
        toast.error("Domain not found");
        return;
      }

      const response = await AxiosInstance.put(
        `/web-management/domain/${itemId}`,
        {
          meta_tag: scriptMeta,
        }
      );

      if (response.data.success) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === itemId ? { ...item, meta_tag: scriptMeta } : item
          )
        );
        toast.success(response.data.message || "Domain updated successfully", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      } else {
        toast.error(response.data.message || "Failed to update domain", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setBtnLoading((prev) => {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDelete = async (e, itemId) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    setBtnLoading((prev) => ({ ...prev, [itemId]: "script_body_delete" }));

    try {
      const response = await AxiosInstance.delete(
        `/web-management/domain/${itemId}`
      );

      if (response.data.success) {
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
        toast.success(response.data.message || "Domain deleted successfully", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      } else {
        toast.error(response.data.message || "Failed to delete domain", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setBtnLoading((prev) => {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleChange = (type, value) => {
    setScriptMeta(value);
  };

  const handleNewDomainChange = (e) => {
    const { name, value } = e.target;
    setNewDomain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    setIsAddingDomain(true);

    try {
      const response = await AxiosInstance.post(
        "/web-management/domain",
        newDomain
      );

      if (response.data.success) {
        setData((prevData) => [...prevData, response.data.data]);
        setNewDomain({
          name: "",
          custom_title: "",
          meta_tag: `<meta name="robots" content="noindex,nofollow" />`,
        });
        toast.success(response.data.message || "Domain added successfully", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      } else {
        toast.error(response.data.message || "Failed to add domain", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setIsAddingDomain(false);
    }
  };

  return isFirstLoad ? (
    <Loader center size="lg" style={{ top: "400px" }} />
  ) : (
    <>
      <Breadcrumb title="Domain Meta Tag" />
      <Card className="mb-3 shadow-sm rounded-0">
        <Card.Body>
          <Form onSubmit={handleAddDomain}>
            <Form.Group controlId="formDomainName" className="mb-3">
              <Form.Label>Domain Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter domain name"
                name="name"
                value={newDomain.name}
                onChange={handleNewDomainChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDomainName" className="mb-3">
              <Form.Label>Custom Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter domain name"
                name="custom_title"
                value={newDomain.custom_title}
                onChange={handleNewDomainChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMetaTag" className="mb-3">
              <Form.Label>Meta Tag</Form.Label>
              <ReactCodeMirror
                height="200px"
                value={newDomain.meta_tag}
                onChange={(value) =>
                  setNewDomain({ ...newDomain, meta_tag: value })
                }
                extensions={[html(), EditorView.lineWrapping]}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              {isAddingDomain ? (
                <Button variant="primary" className="rounded-2" disabled>
                  Saving...
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-2"
                  disabled={isAddingDomain}
                >
                  Add Domain
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      <Accordion className="rounded-0 shadow-sm">
        {data.map((item, index) => (
          <Accordion.Item key={item.id || index} eventKey={index}>
            <Accordion.Header>
              <span className="fw-semibold">{item.name}</span>
            </Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Label>Meta Tag</Form.Label>
                <ReactCodeMirror
                  height="350px"
                  value={item.meta_tag || ""}
                  onChange={(value) => handleChange("scriptBody", value)}
                  extensions={[html(), EditorView.lineWrapping]}
                />
                <div className="d-flex justify-content-end mt-3">
                  {btnLoading[item.id] === "script_body_delete" ? (
                    <Button variant="danger" className="rounded-2" disabled>
                      Deleting...
                    </Button>
                  ) : (
                    <Button
                      className="me-2 rounded-2"
                      variant="danger"
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={btnLoading[item.id] === "script_body"}
                    >
                      Delete
                    </Button>
                  )}

                  {btnLoading[item.id] === "script_body" ? (
                    <Button variant="primary" className="rounded-2" disabled>
                      Saving...
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2"
                      variant="primary"
                      onClick={(e) => saveFormData(e, item.id)}
                      disabled={btnLoading[item.id] === "script_body_delete"}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

export default DomainManagement;
