import { Card, Col, Form, Row } from "react-bootstrap";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { Loader } from "rsuite";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { json } from "@codemirror/lang-json";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const SeoManagement = () => {
  const [loading, setLoading] = useState(false);
  const [robots, setRobots] = useState(null);
  const [metaTag, setMetaTag] = useState(null);
  const [scriptHead, setScriptHead] = useState(null);
  const [scriptBody, setScriptBody] = useState(null);
  const [sitemap, setSiteMap] = useState(null);
  const [btnLoading, setBtnLoading] = useState("");

  const [updatedData, setUpdatedData] = useState({
    robots: null,
    metaTag: null,
    scriptHead: null,
    scriptBody: null,
    sitemap: null,
  });

  const getDataSeo = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/seo-management");
      if (response.data.success) {
        setRobots(response.data.data.robots);
        setMetaTag(response.data.data.meta_tag);
        setScriptHead(response.data.data.script_head);
        setScriptBody(response.data.data.script_body);
        setSiteMap(response.data.data.sitemap);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataSeo();
  }, []);

  const handleChange = (field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const saveFormData = async (e, btn) => {
    e.preventDefault();
    setBtnLoading(btn);
    const dataToSave = {};

    if (updatedData.robots !== null && updatedData.robots !== robots) {
      dataToSave.robots = updatedData.robots;
    }
    if (updatedData.metaTag !== null && updatedData.metaTag !== metaTag) {
      dataToSave.meta_tag = updatedData.metaTag;
    }
    if (
      updatedData.scriptHead !== null &&
      updatedData.scriptHead !== scriptHead
    ) {
      dataToSave.script_head = updatedData.scriptHead;
    }
    if (
      updatedData.scriptBody !== null &&
      updatedData.scriptBody !== scriptBody
    ) {
      dataToSave.script_body = updatedData.scriptBody;
    }
    if (updatedData.sitemap !== null && updatedData.sitemap !== sitemap) {
      dataToSave.sitemap = updatedData.sitemap;
    }

    if (Object.keys(dataToSave).length === 0) {
      toast.info("Tidak ada perubahan yang peru disimpan", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
      setBtnLoading("");
      return;
    }

    try {
      const response = await AxiosInstance.post("/seo-management", dataToSave);
      if (response.data.success) {
        toast.success(response.data.message, {
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
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setBtnLoading("");
    }
  };

  return (
    <>
      {loading ? (
        <Loader center size="lg" style={{ top: "400px" }} />
      ) : (
        <>
        <Breadcrumb title="Seo Management" />
        <Row className="gx-2">
          <Col md={4}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">robots.txt</span>
                {btnLoading === "robots" ? (
                  <Loader size="sm" />
                ) : (
                  <FiSave
                    color="white"
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => saveFormData(e, "robots")}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Form>
                  <CodeMirror
                    height="350px"
                    value={robots || ""}
                    onChange={(value) => handleChange("robots", value)}
                    extensions={[html(), EditorView.lineWrapping]}
                  />
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Meta Tag</span>
                {btnLoading === "meta_tag" ? (
                  <Loader size="sm" />
                ) : (
                  <FiSave
                    color="white"
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => saveFormData(e, "meta_tag")}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Form>
                  <CodeMirror
                    value={metaTag || ""}
                    height="350px"
                    onChange={(value) => handleChange("metaTag", value)}
                    extensions={[html(), EditorView.lineWrapping]}
                  />
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Script In Header</span>
                {btnLoading === "script_head" ? (
                  <Loader size="sm" />
                ) : (
                  <FiSave
                    color="white"
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => saveFormData(e, "script_head")}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Form>
                  <CodeMirror
                    height="350px"
                    value={scriptHead || ""}
                    onChange={(value) => handleChange("scriptHead", value)}
                    extensions={[html(), EditorView.lineWrapping]}
                  />
                  <Form.Text className="text-muted">
                    Skrip-skrip ini akan dicetak di bagian{" "}
                    <strong>&lt;head&gt;</strong>
                  </Form.Text>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Script In Body</span>
                {btnLoading === "script_body" ? (
                  <Loader size="sm" />
                ) : (
                  <FiSave
                    color="white"
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => saveFormData(e, "script_body")}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Form>
                  <CodeMirror
                    height="350px"
                    value={scriptBody || ""}
                    onChange={(value) => handleChange("scriptBody", value)}
                    extensions={[html(), EditorView.lineWrapping]}
                  />
                  <Form.Text className="text-muted">
                    Skrip-skrip ini akan dicetak tepat di bawah tag pembuka{" "}
                    <strong>&lt;body&gt;</strong>
                  </Form.Text>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Sitemap</span>
                {btnLoading === "sitemap" ? (
                  <Loader size="sm" />
                ) : (
                  <FiSave
                    color="white"
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => saveFormData(e, "sitemap")}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Form>
                  <CodeMirror
                    height="350px"
                    value={sitemap || ""}
                    onChange={(value) => handleChange("sitemap", value)}
                    extensions={[json(), EditorView.lineWrapping]}
                  />
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

export default SeoManagement;
