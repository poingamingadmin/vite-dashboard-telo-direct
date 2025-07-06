import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { IoArrowBackSharp } from "react-icons/io5";
import { BeatLoader } from "react-spinners";
import AxiosInstance from "../Api/AxiosInstance";

const PasswordForm = ({ userData, onCancel }) => {
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorPasswordC, setErrorPasswordC] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [validPasswordC, setValidPasswordC] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = (e) => {
    const value = e.target.value;

    if (value === "") {
      setErrorPassword("");
      setValidPassword(false);
    } else if (value.length < 8) {
      setErrorPassword("Password must be at least 8 characters");
      setValidPassword(false);
    } else {
      setErrorPassword("");
      setValidPassword(true);
    }

    setPassword(value);
  };

  const handleChangePasswordC = (e) => {
    const value = e.target.value;

    if (value === "") {
      setErrorPasswordC("");
      setValidPasswordC(false);
    } else if (value !== password) {
      setErrorPasswordC("Passwords do not match");
      setValidPasswordC(false);
    } else {
      setErrorPasswordC("");
      setValidPasswordC(true);
    }

    setPasswordC(value);
  };

  const handleSubmit = async (e) => {
    setLoadingBtn(true);
    setError("");
    setSuccess("");
    e.preventDefault();

    if (!password || !passwordC) {
      setError("Both fields are required.");
      return;
    }

    if (password !== passwordC) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await AxiosInstance.post(
        `/user/${userData.id}/reset-password`,
        {
          newPassword: passwordC,
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoadingBtn(false);
    }

    setError("");
    setPassword("");
    setPasswordC("");
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
        <h5 className="mx-3 mb-0 text-center">Reset Password</h5>
        <hr className="flex-grow-1" />
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>
              New Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handleChangePassword}
              required
              isInvalid={!!errorPassword}
              isValid={validPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errorPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="passwordC">
            <Form.Label>
              Password Confirmation <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              value={passwordC}
              onChange={handleChangePasswordC}
              required
              isInvalid={!!errorPasswordC}
              isValid={validPasswordC}
            />
            <Form.Control.Feedback type="invalid">
              {errorPasswordC}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-100 rounded-2"
            disabled={
              !!errorPassword ||
              !!errorPasswordC ||
              !validPassword ||
              !validPasswordC ||
              loadingBtn
            }
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

export default PasswordForm;
