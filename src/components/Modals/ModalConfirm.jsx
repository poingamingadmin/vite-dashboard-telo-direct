import { useState, useEffect } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const ModalConfirm = ({
  onShow,
  onHide,
  textInfo,
  isTextInputRequired = false,
  handleConfirm,
  btnLoading,
}) => {
  const [deleteText, setDeleteText] = useState("");
  const [isTextValid, setIsTextValid] = useState(false);

  const handleHide = () => {
    setDeleteText("");
    onHide();
  };

  useEffect(() => {
    if (isTextInputRequired) {
      setIsTextValid(deleteText === "DELETE");
    }
  }, [deleteText, isTextInputRequired]);

  return (
    <Modal
      contentClassName="rounded-1"
      centered
      show={onShow}
      onHide={handleHide}
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {textInfo.type.charAt(0).toUpperCase() + textInfo.type.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <span className="fw-semibold fs-3">
              Are you sure you want to{" "}
              <span className={textInfo.type === "delete" ? "text-danger" : "text-success"}>
                {textInfo.type}
              </span>{" "}
              <span className="text-info">{textInfo.itemName}</span> from{" "}
              {textInfo.item}?
            </span>
          </p>
          {isTextInputRequired && (
            <Form.Group>
              <Form.Control
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="Enter DELETE to confirm"
                isInvalid={deleteText && !isTextValid}
              />
              <Form.Control.Feedback type="invalid">
                Please type "DELETE" to confirm.
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="rounded-2" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="rounded-2"
            onClick={handleConfirm}
            disabled={btnLoading || (isTextInputRequired && !isTextValid)}
          >
            {btnLoading ? <BeatLoader size={6} color="#f8f8f8" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default ModalConfirm;
