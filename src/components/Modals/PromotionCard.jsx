import { Button, Card, Form, Row, Col } from "react-bootstrap";
import DatePicker from "rsuite/DatePicker";
import "rsuite/DatePicker/styles/index.css";
import { useState, useEffect } from "react";
import Select from "react-select";
import AxiosInstance from "../Api/AxiosInstance";
import { Loader } from "rsuite";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

const PromotionCard = ({
  onBack,
  cardTitle,
  dataPromotion,
  isCreating,
  setListPromo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [cdnImages, setCdnImages] = useState("");
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    if (dataPromotion) {
      setSelectedCategory(dataPromotion?.category || []);
      setCdnImages(dataPromotion?.cdnImages || "");
      setTitle(dataPromotion?.title || "");
      setEndDate(dataPromotion?.endDate || null);
      setDescription(dataPromotion?.description || "");
    }

    if (dataPromotion?.category) {
      const categoryArray = dataPromotion.category
        .split(", ")
        .map((category) => ({
          value: category,
          label: category,
        }));
      setSelectedCategory(categoryArray);
    }
  }, [dataPromotion]);

  const handleCategoryChange = (selected) => {
    setSelectedCategory(selected);
  };

  const handleImageChange = (event) => {
    setCdnImages(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (value) => {
    setEndDate(value);
  };

  const handleContentChange = (value) => {
    setDescription(value);
  };

  const options = [
    { value: "ALL", label: "ALL" },
    { value: "Special", label: "Khusus" },
    { value: "Sports", label: "Sports" },
    { value: "Slot", label: "Slots" },
    { value: "Casino", label: "Casino" },
    { value: "Others", label: "Others" },
  ];

  const handleSave = async () => {
    setLoadingBtn(true);
    const categoryValues = selectedCategory.map((option) => option.value);
    const promotionData = {
      cdnImages,
      title,
      category: categoryValues,
      endDate,
      description,
    };

    try {
      let response;
      if (isCreating) {
        response = await AxiosInstance.post(
          "/web-management/promotion",
          promotionData
        );
      } else if (dataPromotion?.id) {
        response = await AxiosInstance.put(
          `/web-management/promotion/${dataPromotion.id}`,
          promotionData
        );
      }

      if (response.data.success) {
        setListPromo((prevList) => {
          if (isCreating) {
            return [...prevList, response.data.data];
          } else {
            return prevList.map((promo) =>
              promo.id === response.data.data.id ? response.data.data : promo
            );
          }
        });
        onBack();
      }
    } catch (error) {
      console.error("Error saving or updating promotion:", error);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <Card className="mb-4 rounded-2 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark rounded-0">
        <span className="fs-4 text-white">{cardTitle}</span>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="gx-2">
            <Col md={6}>
              <Form.Label className="fs-3 mb-1">Images</Form.Label>
              <Form.Control
                className="mb-3"
                value={cdnImages}
                onChange={handleImageChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fs-3 mb-1">Title</Form.Label>
              <Form.Control
                className="mb-3"
                value={title}
                onChange={handleTitleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fs-3 mb-1">Category</Form.Label>
              <Select
                isMulti
                className="mb-3"
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={options}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fs-3 mb-1">End Date</Form.Label>
              <DatePicker
                placement="auto"
                className="mb-3"
                block
                size="md"
                value={endDate}
                onChange={handleDateChange}
                oneTap
              />
            </Col>
          </Row>
          <Form.Label className="fs-3 mb-1">Content</Form.Label>
          <ReactCodeMirror
            height="350px"
            value={description || ""}
            onChange={handleContentChange}
            extensions={[html(), EditorView.lineWrapping]}
          />
        </Form>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Button className="rounded-2" variant="secondary" onClick={onBack}>
          {isCreating ? "Cancel" : "Back"}
        </Button>
        <Button
          className="rounded-2 d-flex justify-content-center align-items-center"
          variant="primary"
          onClick={handleSave}
          disabled={loadingBtn}
        >
          {loadingBtn ? (
            <Loader size="sm" content="Please Wait..." />
          ) : isCreating ? (
            "Save Promotion"
          ) : (
            "Update Promotion"
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PromotionCard;
