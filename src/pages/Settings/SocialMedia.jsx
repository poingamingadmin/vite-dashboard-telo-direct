import { javascript } from "@codemirror/lang-javascript";
import {
  Card,
  Row,
  Col,
  Form,
  Table,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { Loader } from "rsuite";
import { MdOutlineSave } from "react-icons/md";
import { html } from "@codemirror/lang-html";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Layouts/Breadcrumb";

const SocialMedia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLiveChat, setLoadingLiveChat] = useState(false);
  const [loadingSocialMedia, setLoadingSocialMedia] = useState(false);

  const getDataWebsite = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/web-management/social-media");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataWebsite();
  }, []);

  const handleLiveChatUpdate = async (e) => {
    e.preventDefault();
    setLoadingLiveChat(true); // Start loading for Live Chat

    const liveChatData = {
      url_livechat: data.livechat?.url_livechat,
      sc_livechat: data.livechat?.sc_livechat,
    };

    try {
      const response = await AxiosInstance.post(
        "/web-management/social-media/livechat",
        liveChatData
      );

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
      toast.error("An error occurred while updating Live Chat.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingLiveChat(false);
    }
  };

  const handleSocialMediaUpdate = async (id, updatedData) => {
    setLoadingSocialMedia(true);

    try {
      const response = await AxiosInstance.post(
        `/web-management/social-media/${id}`,
        updatedData
      );

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
      toast.error("An error occurred while updating Social Media.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
      });
    } finally {
      setLoadingSocialMedia(false); // End loading for Social Media
    }
  };

  return (
    <>
      {loading ? (
        <Loader center size="lg" style={{ top: "400px" }} />
      ) : (
        <>
        <Breadcrumb title="Social Media" />
        <Row className="gx-2">
          <Col md={5}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Live Chat</span>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleLiveChatUpdate}>
                  <Form.Label>URL Live Chat</Form.Label>
                  <Form.Control
                    value={data.livechat?.url_livechat || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        livechat: {
                          ...data.livechat,
                          url_livechat: e.target.value,
                        },
                      })
                    }
                    className="mb-3"
                  />
                  <Form.Label>Script Live Chat</Form.Label>
                  <CodeMirror
                    height="350px"
                    value={data.livechat?.sc_livechat || ""}
                    extensions={[html()]}
                    onChange={(value) =>
                      setData({
                        ...data,
                        livechat: {
                          ...data.livechat,
                          sc_livechat: value,
                        },
                      })
                    }
                  />
                  <Button
                    variant="primary"
                    className="rounded-1 mt-3"
                    type="submit"
                    disabled={loadingLiveChat}
                  >
                    {loadingLiveChat ? "Saving..." : "Save Changes"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={7}>
            <Card className="rounded-0 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
                <span className="fs-4 text-white">Social Media</span>
              </Card.Header>
              <Card.Body>
                <Table
                  responsive
                  hover
                  size="sm"
                  style={{ width: "100%" }}
                  className="text-nowrap align-middle"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Platform</th>
                      <th>Link</th>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.social_media &&
                      data.social_media.map((social, idx) => (
                        <tr key={social.id}>
                          <td>{idx + 1}</td>
                          <td>{social.title}</td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={social.link || ""}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  social_media: data.social_media.map((sm) =>
                                    sm.id === social.id
                                      ? { ...sm, link: e.target.value }
                                      : sm
                                  ),
                                })
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              value={social.description || ""}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  social_media: data.social_media.map((sm) =>
                                    sm.id === social.id
                                      ? { ...sm, description: e.target.value }
                                      : sm
                                  ),
                                })
                              }
                            />
                          </td>
                          <td className="text-center">
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="save-tooltip">Save</Tooltip>
                              }
                            >
                              <Button
                                variant="link"
                                onClick={() =>
                                  handleSocialMediaUpdate(social.id, {
                                    link: social.link,
                                    description: social.description,
                                  })
                                }
                                disabled={loadingSocialMedia}
                              >
                                <MdOutlineSave size={20} />
                              </Button>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <Form.Text className="text-muted">
                  Kosongkan untuk yang tidak perlu
                </Form.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </>
        
      )}
    </>
  );
};

export default SocialMedia;
