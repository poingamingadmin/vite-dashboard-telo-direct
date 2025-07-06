/* eslint-disable no-undef */
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import { useContext, useState, useEffect } from "react";
import PasswordModal from "./PasswordModal";
import { UserContext } from "../../contexts/UserContext";
import AxiosInstance from "../../components/Api/AxiosInstance";
import Loader from "rsuite/Loader";
import "rsuite/Loader/styles/index.css";
import CreateAdminModal from "./CreateAdminModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateAdminModal from "./UpdateAdminModal";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import { useApiData } from "../../contexts/ApiDataContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [agentBalance, setAgentBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [adminData, setAdminData] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showModalUpdateAdmin, setShowModalUpdateAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    level: "",
    maxTransaction: "",
  });
  const [showModalDelete, setShowModalDelete] = useState(false);
  const data = useApiData();

  const fectDataAdmin = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("admin/informations");
      if (response.data.success) {
        setAdminData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fectListAdmin = async () => {
    try {
      setLoadingTable(true);
      const response = await AxiosInstance.get("admin");
      if (response.data.success) {
        setAdminList(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (data) {
      setAgentBalance(data.total_balance_agent || 0);
      setUserBalance(data.total_balance_user || 0);
    }
  }, [data]);

  const formattedUserBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(userBalance);

  const formattedAgentBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(agentBalance);

  const handleConfirmCreateAdmin = async () => {
    const formattedMaxTransaction = formData.maxTransaction.replace(/,/g, "");

    const updatedFormData = {
      ...formData,
      maxTransaction: formattedMaxTransaction,
    };

    console.log(updatedFormData);

    try {
      setLoadingBtn(true);
      const response = await AxiosInstance.post("admin", updatedFormData);

      console.log(response);

      if (response.data.success) {
        setAdminList((prevAdminList) => [...prevAdminList, response.data.data]);

        setFormData({
          username: "",
          password: "",
          level: "",
          maxTransaction: "",
        });

        setShowCreateAdminModal(false);
      } else {
        alert("Failed to create admin. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("There was an error while creating the admin. Please try again.");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleConfirmUpdateAdmin = async () => {
    const formattedMaxTransaction = formData.maxTransaction.replace(/,/g, "");

    const updatedFormData = {
      ...formData,
      maxTransaction: formattedMaxTransaction,
    };

    console.log(updatedFormData);

    try {
      setLoadingBtn(true);
      const response = await AxiosInstance.put("admin", updatedFormData);

      console.log(response);

      if (response.data.success) {
        setAdminList((prevAdminList) =>
          prevAdminList.map((admin) =>
            admin.id === response.data.data.id
              ? { ...admin, ...response.data.data }
              : admin
          )
        );

        setFormData({
          username: "",
          password: "",
          level: "",
          maxTransaction: "",
        });
        setShowModalUpdateAdmin(false);
      } else {
        alert("Failed to update admin. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleEditAdmin = (adminId) => {
    const admin = adminList.find((admin) => admin.id === adminId);

    setShowModalUpdateAdmin(true);

    if (admin) {
      setFormData({
        id: adminId,
        username: admin.username,
        password: null,
        level: admin.role,
        maxTransaction: admin.max_transaction,
      });
    }
  };

  const handleConfirmDelete = async () => {
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.delete(`admin/${formData.id}`);
      if (response.data.success) {
        setAdminList((prevAdminList) =>
          prevAdminList.filter((admin) => admin.id !== formData.id)
        );
        setFormData({
          username: "",
          password: "",
          level: "",
          maxTransaction: "",
        });
        setShowModalDelete(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleClickDelete = (adminId) => {
    const admin = adminList.find((admin) => admin.id === adminId);

    if (admin) {
      setFormData({
        id: adminId,
        username: admin.username,
        password: null,
        level: admin.role,
        maxTransaction: admin.max_transaction,
      });
      setShowModalDelete(true);
    }
  };

  const handleCloseModal = () => {
    setShowCreateAdminModal(false);
    setShowModalDelete(false);
    setShowModalUpdateAdmin(false);
    setFormData({
      username: "",
      password: "",
      level: "",
      maxTransaction: "",
    });
  };

  useEffect(() => {
    fectDataAdmin();
    fectListAdmin();
  }, []);

  return (
    <>
      <Breadcrumb title="Profile" />
      <Row>
        <Col md={4}>
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="fw-semibold rounded-0">
              <span className="h5">My Profile & Website Details</span>
            </Card.Header>
            <Card.Body>
              <Table
                bordered
                style={{ width: "100%" }}
                className="align-middle table-sm-custom"
              >
                <tbody>
                  <tr>
                    <td>Agent Code</td>
                    <td className="text-end fw-semibold">
                      {user?.agent_code.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td>Level</td>
                    <td className="text-end fw-semibold">{user?.role}</td>
                  </tr>
                  <tr>
                    <td>Total Users</td>
                    <td className="text-end fw-semibold">
                      {loading ? <Loader size="xs" /> : adminData?.total_user}
                    </td>
                  </tr>
                  <tr>
                    <td>Total New Users</td>
                    <td className="text-end fw-semibold">
                      {loading ? (
                        <Loader size="xs" />
                      ) : (
                        adminData?.total_new_user
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Deposit</td>
                    <td className="text-end fw-semibold">
                      {loading ? (
                        <Loader size="xs" />
                      ) : adminData?.total_deposit ? (
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(adminData?.total_deposit)
                      ) : (
                        "0"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Withdrawal</td>
                    <td className="text-end fw-semibold">
                      {loading ? (
                        <Loader size="xs" />
                      ) : adminData?.total_withdraw ? (
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(adminData?.total_withdraw)
                      ) : (
                        "0"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Win/Lose</td>
                    <td className="text-end fw-semibold">
                      {loading ? (
                        <Loader size="xs" />
                      ) : adminData?.total_win_lose ? (
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(adminData?.total_win_lose)
                      ) : (
                        "0"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Agent Balance</td>
                    <td className="text-end fw-semibold">
                      {loading ? <Loader size="xs" /> : formattedAgentBalance}
                    </td>
                  </tr>
                  <tr>
                    <td>Total User Balance</td>
                    <td className="text-end fw-semibold">
                      {loading ? <Loader size="xs" /> : formattedUserBalance}
                    </td>
                  </tr>

                  <tr>
                    <td>Password</td>
                    <td className="text-end fw-semibold">
                      <a href="#" onClick={() => setShowModalPassword(true)}>
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="h6 rounded-0">
              <div className="d-flex justify-content-between align-items-center w-100">
                <span className="h5">Admin Management</span>
                <Button
                  role="button"
                  onClick={() => setShowCreateAdminModal(true)}
                  className="mb-0 rounded-2"
                >
                  Create New Admin
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                size="sm"
                bordered
                style={{ width: "100%" }}
                className="align-middle"
              >
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Username</th>
                    <th className="text-center">Level</th>
                    <th className="text-center">Max Transactions</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTable ? (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Loading data...
                      </td>
                    </tr>
                  ) : adminList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    adminList.map((data, idx) => {
                      return (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="text-center">{data.username}</td>
                          <td className="text-center">
                            {data.roles?.[0]?.name || "No Role Assigned"}
                          </td>
                          <td className="text-center">
                            {data?.max_transaction
                              ? new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(data?.max_transaction)
                              : 0}
                          </td>
                          <td className="text-end">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip id="eye-tooltip">Edit</Tooltip>}
                            >
                              <a
                                role="button"
                                className="btn btn-sm btn-link"
                                onClick={() => handleEditAdmin(data.id)}
                              >
                                <FaEdit size={15} />
                              </a>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="trash-tooltip">Delete</Tooltip>
                              }
                            >
                              <a
                                role="button"
                                onClick={() => handleClickDelete(data.id)}
                                className="btn btn-sm btn-link"
                              >
                                <FaTrash size={15} color="red" />
                              </a>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PasswordModal
        onShow={showModalPassword}
        onHide={() => setShowModalPassword(false)}
      />
      <CreateAdminModal
        onHide={handleCloseModal}
        onShow={showCreateAdminModal}
        onConfirm={handleConfirmCreateAdmin}
        formData={formData}
        setFormData={setFormData}
        loadingBtn={loadingBtn}
      />
      <UpdateAdminModal
        onHide={handleCloseModal}
        onShow={showModalUpdateAdmin}
        onConfirm={handleConfirmUpdateAdmin}
        formData={formData}
        setFormData={setFormData}
        loadingBtn={loadingBtn}
      />
      <ModalConfirm
        textInfo={{
          itemName: (
            <span className="text-danger fw-semibold">{formData.username}</span>
          ),
          item: <span className="text-primary fw-semibold">Admin</span>,
          type: "delete",
        }}
        onShow={showModalDelete}
        onHide={handleCloseModal}
        handleConfirm={handleConfirmDelete}
        btnLoading={loadingBtn}
      />
    </>
  );
};

export default Profile;
