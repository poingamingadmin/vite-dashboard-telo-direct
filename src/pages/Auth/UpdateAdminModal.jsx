import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const UpdateAdminModal = ({
  onShow,
  onHide,
  onConfirm,
  formData,
  setFormData,
  loadingBtn
}) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (!formData.level) newErrors.level = "Level is required.";
    if (!formData.maxTransaction)
      newErrors.maxTransaction = "Max Transaction is required.";
    if (isNaN(formData.maxTransaction.replace(/,/g, "")))
      newErrors.maxTransaction = "Max Transaction must be a valid number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMaxTransactionChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setFormData({ ...formData, maxTransaction: formattedValue });
  };

  return (
    <Modal show={onShow} onHide={onHide} centered contentClassName="rounded-2">
      <Container>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              className="mb-3"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "block", marginTop: "-10px" }}
            >
              {errors.username}
            </Form.Control.Feedback>

            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className="mb-3"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Form.Label>Level</Form.Label>
            <Form.Select
              className="mb-3"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              isInvalid={!!errors.level}
            >
              <option value="">Select Level</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </Form.Select>
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "block", marginTop: "-10px" }}
            >
              {errors.level}
            </Form.Control.Feedback>

            <Form.Label>Max Transaction</Form.Label>
            <Form.Control
              type="text"
              className="mb-3"
              value={formData.maxTransaction}
              onChange={handleMaxTransactionChange}
              isInvalid={!!errors.maxTransaction}
            />
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "block", marginTop: "-10px" }}
            >
              {errors.maxTransaction}
            </Form.Control.Feedback>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="rounded-2" onClick={onHide}>
              Close
            </Button>
            <Button className="rounded-2" type="submit">
            {loadingBtn ? <BeatLoader size={6} color="#f8f8f8" /> : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Container>
    </Modal>
  );
};

export default UpdateAdminModal;
