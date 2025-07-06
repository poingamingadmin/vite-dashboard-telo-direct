import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { IoArrowBackSharp } from "react-icons/io5";
import AxiosInstance from "../Api/AxiosInstance";
import { BeatLoader } from "react-spinners";

const DepositForm = ({ userData, onCancel, updateUserData }) => {
  const [amount, setAmount] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    setLoadingBtn(true);
    setError("");
    setSuccess("");
    const amountDeposit = amount.replace(/,/g, "");
    e.preventDefault();
    try {
      const response = await AxiosInstance.post(
        `/user/${userData.id}/deposit`,
        {
          amount: parseFloat(amountDeposit),
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        updateUserData((prevUserData) => ({
          ...prevUserData,
          active_balance: response.data.data.new_balance,
        }));
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoadingBtn(false);
    }

    setAmount("");
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mb-3">
        <Button
          variant="link"
          role="button"
          className="me-2"
          onClick={onCancel}
        >
          <IoArrowBackSharp size={20} />
        </Button>
        <h5 className="mx-3 mb-0 text-center">Deposit</h5>
        <hr className="flex-grow-1" />
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={userData.username}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} controlId="phone">
              <Form.Label>Active Balance</Form.Label>
              <Form.Control
                type="text"
                value={new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(userData?.active_balance)}
                readOnly
                disabled
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="depositAmount">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-100 rounded-2"
            disabled={!amount || loadingBtn}
          >
            {loadingBtn ? <BeatLoader size={8} color="#f8f8f8" /> : "Submit"}
          </Button>
        </Form>
        <Alert
          show={Boolean(success || error)}
          className="mt-3"
          variant={success ? "success" : "danger"}
          transition={true}
        >
          {success || error}
        </Alert>
      </Container>
    </>
  );
};

export default DepositForm;
