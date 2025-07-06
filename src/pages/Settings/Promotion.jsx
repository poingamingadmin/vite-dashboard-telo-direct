import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import AxiosInstance from "../../components/Api/AxiosInstance";
import PromotionCard from "../../components/Modals/PromotionCard";
import { useEffect, useState } from "react";
import { Loader } from "rsuite";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";

const Promotion = () => {
  const [listPromo, setListPromo] = useState([]);
  const [dataPromotion, setDataPromotion] = useState(null);
  const [actions, setActions] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const getDataPromo = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/web-management/promotion");
      if (response.data.success) {
        setListPromo(response.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModalDelete(false);
    setDataPromotion(null);
    setShowModalDelete(false);
  };

  const handleShowForm = (action, id) => {
    setActions(action);
    if (action === "store") {
      setDataPromotion({
        cdnImages: "",
        title: "",
        category: "",
        endDate: "",
        description: "",
      });
      setIsCreating(true);
    } else if (action === "update") {
      const promoToUpdate = listPromo.find((promo) => promo.id === id);
      setDataPromotion(promoToUpdate);
      setIsCreating(false);
    }
  };

  const handleClickDelete = (id) => {
    const promotToDelete = listPromo.find((promoId) => promoId.id === id);
    if (promotToDelete) {
      setDataPromotion({
        id: id,
        name: promotToDelete.title,
      });
    }
    setShowModalDelete(true);
  };

  const handleBackToCard = () => {
    setActions("");
  };

  const handleDelete = async () => {
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.delete(
        `/web-management/promotion/${dataPromotion.id}`
      );

      if (response.data.success) {
        setListPromo((prevList) =>
          prevList.filter((promo) => promo.id !== dataPromotion.id)
        );
      } else {
        console.error("Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
    } finally {
      setLoadingBtn(false);
      setShowModalDelete(false);
    }
  };

  useEffect(() => {
    getDataPromo();
  }, []);

  return (
    <>
      {loading ? (
        <Loader
          size="lg"
          center
          style={{
            top: "400px",
          }}
        />
      ) : actions === "" ? (
        <>
          <Breadcrumb title="Promotion Pages" />
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
              <span className="fs-4 text-white">Promotion</span>
              <Button
                onClick={() => handleShowForm("store")}
                className="rounded-2"
              >
                Create Promotion
              </Button>
            </Card.Header>
            <Card.Body>
              {listPromo.length > 0 ? (
                <Row>
                  {listPromo.map((data, idx) => (
                    <Col xs={12} sm={6} md={4} key={idx} className="mb-4">
                      <Card>
                        <Card.Img variant="top" src={data.cdnImages} />
                        <Card.Body>
                          <Card.Title>{data.title}</Card.Title>
                          <Card.Text>{data.description}</Card.Text>
                          <Card.Text>
                            <strong>Category:</strong> {data.category}
                          </Card.Text>
                          <Card.Text>
                            <strong>End Date:</strong> {data.endDate}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Button
                            variant="primary"
                            className="me-2 rounded-2"
                            onClick={() => handleShowForm("update", data.id)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="danger"
                            className="rounded-2"
                            onClick={() => handleClickDelete(data.id)}
                          >
                            Delete
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="danger" className="text-center">
                  No promotion available
                </Alert>
              )}
            </Card.Body>
          </Card>
        </>

      ) : (
        <PromotionCard
          onBack={handleBackToCard}
          cardTitle={
            actions === "store" ? "Create Promotion" : "Update Promotion"
          }
          dataPromotion={dataPromotion}
          isCreating={isCreating}
          setListPromo={setListPromo}
        />
      )}
      <ModalConfirm
        textInfo={{
          itemName: (
            <span className="text-danger fw-semibold">
              {dataPromotion?.name || ""}
            </span>
          ),
          item: <span className="text-primary fw-semibold">Promotion</span>,
          type: "delete"
        }}
        onShow={showModalDelete}
        onHide={handleCloseModal}
        handleConfirm={handleDelete}
        btnLoading={loadingBtn}
      />
    </>
  );
};

export default Promotion;
