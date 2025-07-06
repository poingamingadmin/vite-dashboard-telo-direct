import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";
import AxiosInstance from "../Api/AxiosInstance";
import { BeatLoader } from "react-spinners";

const BankAccountForm = ({ userData, onCancel, updateUserData }) => {
  const [bankName, setBankName] = useState(userData.bank_name || "");
  const [accountName, setAccountName] = useState(userData.account_name || "");
  const [accountNumber, setAccountNumber] = useState(userData.account_number || "");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    setError("");
    setSuccess("");

    try {
      const response = await AxiosInstance.post(
        `/user/${userData.id}/update-bank-account`,
        {
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);

        updateUserData((prevUserData) => ({
          ...prevUserData,
          bank_name: response.data.data.bank_name,
          account_name: response.data.data.account_name,
          account_number: response.data.data.account_number,
        }));

        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        setError("Gagal memperbarui data.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoadingBtn(false);
    }
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
        <h5 className="mx-3 mb-0 text-center">Edit Bank Account</h5>
        <hr className="flex-grow-1" />
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={userData.username}
                readOnly
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} className="mb-3" controlId="bankName">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="accountName">
            <Form.Label>
              Account Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="accountNumber">
            <Form.Label>
              Account Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-100 rounded-2 mt-2"
            disabled={loadingBtn}
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

export default BankAccountForm;
