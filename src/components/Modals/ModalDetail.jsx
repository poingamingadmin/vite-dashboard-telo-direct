import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalDetail = ({ modalTitle, ModalContent, onShow, onHide }) => {
  const contentRef = useRef();

  const handleSave = async () => {
    if (contentRef.current?.handleSave) {
      await contentRef.current.handleSave();
    }
  };

  return (
    <Modal dialogClassName="modal-xl custom-modal-xl" contentClassName="rounded-1" centered show={onShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ModalContent && React.cloneElement(ModalContent, { ref: contentRef })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetail;
