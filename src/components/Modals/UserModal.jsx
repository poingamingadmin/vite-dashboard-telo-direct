import { Container, Modal, Table } from "react-bootstrap";
import DepositForm from "../Forms/Deposit";
import { useState } from "react";
import WithdrawalForm from "../Forms/Withdrawal";
import PasswordForm from "../Forms/Password";
import BankAccountForm from "../Forms/BankAccount";
import AxiosInstance from "../Api/AxiosInstance";
import { BeatLoader } from "react-spinners";

const UserModal = ({
  onShow,
  handleCloseModal,
  userData,
  updateUserData,
  updateListData,
}) => {
  const [activeForm, setActiveForm] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingBtn2, setLoadingBtn2] = useState(false);

  const handleCancelForm = () => {
    setActiveForm(null);
  };

  const handleActionClick = (action) => {
    setActiveForm(action);
  };

  const handleClose = () => {
    updateListData(userData);
    setActiveForm(null);
    handleCloseModal();
  };

  const handleSuspendUser = async (e, field) => {
    setLoadingBtn(true);
    e.preventDefault();
    try {
      const response = await AxiosInstance.post(`/user/${userData.id}/status/${field}`);
      if (response.data.success) {
        updateUserData((prevUserData) => ({
          ...prevUserData,
          can_login: response.data.data.can_login,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleSuspendGame = async (e, field) => {
    setLoadingBtn2(true);
    e.preventDefault();
    try {
      const response = await AxiosInstance.post(`/user/${userData.id}/status/${field}`);
      if (response.data.success) {
        updateUserData((prevUserData) => ({
          ...prevUserData,
          can_play_game: response.data.data.can_play_game,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn2(false);
    }
  };

  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      centered
      contentClassName={`rounded-1`}
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "500px" }}>
          {activeForm === null ? (
            <div className="row gx-1">
              <div className="col-md-12 mb-1">
                <Table size="sm">
                  <tbody>
                    <tr>
                      <th scope="row">Username</th>
                      <td>
                        <span className="fw-semibold text-primary me-1">
                          {userData?.username}
                        </span>
                        {userData?.tag && (
                          <span className="label-shape">NEW</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">canLogin</th>
                      <td>
                        <span
                          className={`${userData?.can_login
                            ? "text-success"
                            : "text-danger"
                            } fw-semibold`}
                        >
                          {userData?.can_login ? "TRUE" : "FALSE"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">canPlayGame</th>
                      <td>
                        <span
                          className={`${userData?.can_play_game
                            ? "text-success"
                            : "text-danger"
                            } fw-semibold`}
                        >
                          {userData?.can_play_game ? "TRUE" : "FALSE"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Balance</th>
                      <td className="text-danger">
                        <strong>
                          {new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                          }).format(userData?.active_balance)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Phone</th>
                      <td>
                        <strong>{userData?.phone}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Join Date</th>
                      <td>
                        <strong>
                          {new Date(userData?.created_at).toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Full Name</th>
                      <td>
                        <strong>{userData?.account_name}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Bank Name</th>
                      <td>
                        <strong>{userData?.bank_name}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Bank Number</th>
                      <td>
                        <strong>{userData?.account_number}</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col-md-6 mb-1">
                <button
                  className="btn btn-outline-secondary w-100 rounded-1"
                  onClick={() => handleActionClick("deposit")}
                >
                  Deposit
                </button>
              </div>
              <div className="col-md-6 mb-1">
                <button
                  className="btn btn-outline-secondary w-100 rounded-1"
                  onClick={() => handleActionClick("withdrawal")}
                >
                  Withdrawal
                </button>
              </div>
              <div className="col-md-6 mb-1">
                <button
                  className="btn btn-outline-secondary w-100 rounded-1"
                  onClick={() => handleActionClick("reset-password")}
                >
                  Reset Password
                </button>
              </div>
              <div className="col-md-6 mb-1">
                <button
                  className="btn btn-outline-secondary w-100 rounded-1"
                  onClick={() => handleActionClick("edit-bank")}
                >
                  Edit Account Bank
                </button>
              </div>

              <div className="col-md-6 mb-1">
                {userData?.can_login ? (
                  <button
                    className="btn btn-outline-danger w-100 rounded-1"
                    onClick={(e) => handleSuspendUser(e, 'can_login')}
                  >
                    {loadingBtn ? (
                      <BeatLoader size={5} color="#545b62" />
                    ) : (
                      "Disable Login"
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success w-100 rounded-1"
                    onClick={(e) => handleSuspendUser(e, 'can_login')}
                  >
                    {loadingBtn ? (
                      <BeatLoader size={5} color="#545b62" />
                    ) : (
                      "Enable Login"
                    )}
                  </button>
                )}
              </div>

              <div className="col-md-6 mb-1">
                {userData?.can_play_game ? (
                  <button
                    className="btn btn-outline-danger w-100 rounded-1"
                    onClick={(e) => handleSuspendGame(e, 'can_play_game')}
                  >
                    {loadingBtn2 ? (
                      <BeatLoader size={5} color="#545b62" />
                    ) : (
                      "Disable Game"
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success w-100 rounded-1"
                    onClick={(e) => handleSuspendGame(e, 'can_play_game')}
                  >
                    {loadingBtn2 ? (
                      <BeatLoader size={5} color="#545b62" />
                    ) : (
                      "Enable Game"
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            activeForm === "deposit" && (
              <DepositForm
                userData={userData}
                updateUserData={updateUserData}
                onCancel={handleCancelForm}
              />
            )
          )}
          {activeForm === "withdrawal" && (
            <WithdrawalForm
              userData={userData}
              updateUserData={updateUserData}
              onCancel={handleCancelForm}
            />
          )}
          {activeForm === "reset-password" && (
            <PasswordForm userData={userData} onCancel={handleCancelForm} />
          )}
          {activeForm === "edit-bank" && (
            <BankAccountForm
              userData={userData}
              updateUserData={updateUserData}
              onCancel={handleCancelForm}
            />
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Container>
    </Modal>
  );
};

export default UserModal;
