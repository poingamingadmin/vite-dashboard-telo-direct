import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const ModalPromotionDeposit = ({
  onShow,
  onHide,
  bonusData,
  modalTitle,
  loadingBtn,
  handleSubmit,
  errors,
  handleChange,
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
                  Bonus Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.bonusName}
                  value={bonusData?.bonusName}
                  onChange={(e) => handleChange("bonusName", e.target.value)}
                  className="mb-3"
                />

                <Form.Label>
                  Type Bonus <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.TypeBonus}
                  className="mb-3"
                  value={bonusData?.typeBonus}
                  onChange={(e) => handleChange("typeBonus", e.target.value)}
                >
                  <option value="">Select Type Bonus</option>
                  <option value="bonus_persen">%</option>
                  <option value="bonus_fixed">IDR</option>
                </Form.Select>

                <Form.Label>
                  Amount {bonusData?.typeBonus === "bonus_persen" ? "%" : "IDR"}{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.amountBonus}
                  value={bonusData?.amountBonus}
                  placeholder={
                    bonusData?.typeBonus === "bonus_persen" ? "0" : "0"
                  }
                  onChange={(e) => handleChange("amountBonus", e.target.value)}
                  className="mb-3"
                />

                <Form.Label>
                  Category User <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.categoryUser}
                  className="mb-3"
                  value={bonusData?.categoryUser}
                  onChange={(e) => handleChange("categoryUser", e.target.value)}
                >
                  <option value="">Select Type User</option>
                  <option value="all">All Member</option>
                  <option value="new">New Member</option>
                </Form.Select>

                <Form.Label>
                  Maximum Bonus Amount <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.maxAmountBonus}
                  value={formatNumberWithComma(bonusData?.maxAmountBonus)}
                  placeholder="0"
                  onChange={(e) =>
                    handleTransactionInputChange(
                      "maxAmountBonus",
                      e.target.value
                    )
                  }
                  className="mb-3"
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>
                  Target Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.targetType}
                  className="mb-3"
                  value={bonusData?.targetType}
                  onChange={(e) => handleChange("targetType", e.target.value)}
                >
                  <option value="">Select Target Type</option>
                  <option value="target_turnover">TO</option>
                  <option value="max_withdrawal">WO</option>
                </Form.Select>
                <Form.Label>
                  Min Transaction <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.minTransaction}
                  value={formatNumberWithComma(bonusData?.minTransaction)}
                  onChange={(e) =>
                    handleTransactionInputChange(
                      "minTransaction",
                      e.target.value
                    )
                  }
                  className="mb-3"
                />

                <Form.Label>
                  Target TO/WO <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.targetTOWO}
                  onChange={(e) => handleChange("targetTOWO", e.target.value)}
                  value={bonusData?.targetTOWO}
                  className="mb-3"
                />

                <Form.Label>
                  Max Claims / Member <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.maxClaims}
                  onChange={(e) => handleChange("maxClaims", e.target.value)}
                  value={bonusData?.maxClaims}
                  className="mb-3"
                />

                <Form.Label>
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errors.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  value={bonusData?.description}
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

export default ModalPromotionDeposit;
