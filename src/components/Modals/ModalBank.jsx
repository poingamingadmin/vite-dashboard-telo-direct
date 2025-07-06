import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const ModalBank = ({
  onShow,
  onHide,
  bankData,
  modalTitle,
  loadingBtn,
  listCategoryBank,
  listBankName,
  handleCategoryChange,
  handleChange,
  handleSubmit,
  errors,
  actions,
}) => {
  const formatNumberWithComma = (value) => {
    if (!value) return "";
    const cleanValue = value.replace(/[^\d]/g, "");
    if (cleanValue === "") return "";
    return parseInt(cleanValue, 10).toLocaleString();
  };

  const handleTransactionInputChange = (field, value) => {
    const cleanValue = value.replace(/[^\d]/g, "");
    handleChange(field, cleanValue);
  };

  const getBankType = (type) => {
    const bankType = parseInt(type, 10);
    switch (bankType) {
      case 5:
        return "BANK";
      case 6:
        return "PULSA";
      case 7:
        return "E WALLET";
      case 8:
        return "QRIS";
      default:
        return "Unknown Type";
    }
  };

  return (
    <Modal
      contentClassName="rounded-1"
      size="lg"
      centered
      show={onShow}
      onHide={onHide}
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col xs={12} md={6}>
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                {actions === "edit-bank" ? (
                  <Form.Control
                    value={getBankType(bankData.category)}
                    className="mb-3"
                    disabled
                  />
                ) : (
                  <Form.Select
                    isInvalid={!!errors.category}
                    as="select"
                    value={bankData.category}
                    onChange={(e) => handleCategoryChange(e)}
                    name="category"
                    className="mb-3"
                  >
                    <option value="">Select Category</option>
                    {listCategoryBank.map((category) => (
                      <option key={category.code} value={category.code}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Label>
                  Bank Name <span className="text-danger">*</span>
                </Form.Label>
                {actions === "edit-bank" ? (
                  <Form.Control
                    value={bankData.bankName}
                    className="mb-3"
                    disabled
                  />
                ) : (
                  <Form.Select
                    isInvalid={!!errors.bankName}
                    as="select"
                    className="mb-3"
                    value={bankData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    name="bankName"
                  >
                    <option value="">Select Bank Name</option>
                    {listBankName.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Label>
                  Account Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.accountName}
                  value={bankData.accountName}
                  onChange={(e) => handleChange("accountName", e.target.value)}
                  className="mb-3"
                />
                <Form.Label>
                  Account Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.accountNumber}
                  value={bankData.accountNumber}
                  onChange={(e) =>
                    handleChange("accountNumber", e.target.value)
                  }
                  className="mb-3"
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>Qris Image</Form.Label>
                <Form.Control
                  onChange={(e) => handleChange("qrisImage", e.target.value)}
                  value={bankData.qrisImage}
                  className="mb-3"
                />
                <Form.Label>
                  Min Transaction <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.minTransaction}
                  value={formatNumberWithComma(bankData.minTransaction)}
                  onChange={(e) =>
                    handleTransactionInputChange(
                      "minTransaction",
                      e.target.value
                    )
                  }
                  className="mb-3"
                />
                <Form.Label>
                  Max Transaction <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.maxTransaction}
                  value={formatNumberWithComma(bankData.maxTransaction)}
                  onChange={(e) =>
                    handleTransactionInputChange(
                      "maxTransaction",
                      e.target.value
                    )
                  }
                  className="mb-3"
                />
                <Form.Label>Unique Code Transaction</Form.Label>
                <Form.Control
                  onChange={(e) => handleChange("uniqueCode", e.target.value)}
                  value={bankData.uniqueCode}
                  className="mb-3"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="rounded-1" onClick={onHide}>
              Close
            </Button>
            <Button type="submit" variant="primary" className="rounded-1">
              {loadingBtn ? <BeatLoader size={6} color="#f8f8f8" /> : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Container>
    </Modal>
  );
};

export default ModalBank;
