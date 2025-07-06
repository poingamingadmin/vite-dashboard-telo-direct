import { useState } from "react";
import useDataTable from "../../components/Tables/useDataTable";
import GenericTable from "../../components/Tables/GenericTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalBank from "../../components/Modals/ModalBank";
import AxiosInstance from "../../components/Api/AxiosInstance";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import { toast } from "react-toastify";

const IndexBankManagement = () => {
  const endPoint = "/bank-deposit";
  const [actions, setActions] = useState("");
  const [modalTite, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [bankData, setBankData] = useState({
    category: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    qrisImage: "",
    minTransaction: "",
    maxTransaction: "",
    uniqueCode: "",
  });

  const {
    listData,
    setListData,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    perPage,
    setPerPage,
    totalRecord,
    dateRange,
    setDateRange,
    isFirstLoad,
    recordsFiltered,
    pageIndex,
    perPageIndex,
  } = useDataTable(endPoint);

  const [listCategoryBank, setListCategoryBank] = useState([
    {
      code: "5",
      name: "BANK",
      list: [
        "BCA",
        "BNI",
        "BRI",
        "SEABANK",
        "BANKJAGO",
        "MANDIRI",
        "PERMATA",
        "CIMB",
        "BSI",
      ],
    },
    {
      code: "7",
      name: "EWALLET",
      list: ["OVO", "GOPAY", "DANA", "LINKAJA", "SHOPEEPAY", "QRIS"],
    },
    {
      code: "6",
      name: "PULSA",
      list: ["XL", "TELKOMSEL"],
    },
  ]);

  const handleValidation = () => {
    const newErrors = {};

    if (!bankData.category) {
      newErrors.category = "Category is required";
    }

    if (!bankData.bankName) {
      newErrors.bankName = "Bank Name is required";
    }

    if (!bankData.accountName) {
      newErrors.accountName = "Account Name is required";
    }

    if (!bankData.accountNumber) {
      newErrors.accountNumber = "Account Number is required";
    }

    if (!bankData.minTransaction) {
      newErrors.minTransaction = "Min Transaction is required";
    } else if (isNaN(bankData.minTransaction.replace(/[^\d]/g, ""))) {
      newErrors.minTransaction = "Min Transaction must be a valid number";
    }

    if (!bankData.maxTransaction) {
      newErrors.maxTransaction = "Max Transaction is required";
    } else if (isNaN(bankData.maxTransaction.replace(/[^\d]/g, ""))) {
      newErrors.maxTransaction = "Max Transaction must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [listBankName, setListBankName] = useState([]);

  const columns = [
    {
      name: "#",
      style: { textAlign: "center" },
    },
    {
      name: "Created Date",
      style: {},
    },
    {
      name: "Bank Name",
      style: {},
    },
    {
      name: "Account Name",
      style: {},
    },
    {
      name: "Account Number",
      style: {},
    },
    {
      name: "Min/Max Transactions",
      style: {},
    },
    {
      name: "Code",
      style: {},
    },
    {
      name: "Type Display",
      style: {},
    },
    {
      name: "Status",
      style: {},
    },
    {
      name: "Show",
      style: {},
    },
    {
      name,
      style: { textAlign: "end" },
    },
  ];

  const handleCreateBank = (actions) => {
    setShowModal(true);
    setModalTitle("Create New Bank Deposit");
    setActions(actions);
  };

  const handleEditBank = (actions, bankId) => {
    const bankToEdit = listData.find((bank) => bank.id === bankId);

    if (bankToEdit) {
      setBankData({
        bankId: bankId,
        category: bankToEdit.type || "",
        bankName: bankToEdit.bank_name || "",
        accountName: bankToEdit.account_name || "",
        accountNumber: bankToEdit.account_number || "",
        qrisImage: bankToEdit.qris_img || "",
        minTransaction: bankToEdit.min_deposit || "",
        maxTransaction: bankToEdit.max_deposit || "",
        uniqueCode: bankToEdit.unique_code || "",
      });
    }

    setShowModal(true);
    setModalTitle("Edit Bank Deposit");
    setActions(actions);
  };

  const handleCloseModal = () => {
    setBankData({
      category: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      qrisImage: "",
      minTransaction: "",
      maxTransaction: "",
      uniqueCode: "",
    });
    setShowModal(false);
    setModalTitle("");
    setActions("");
    setShowModalDelete(false);
  };

  const handleSubmitCreateBank = async (e) => {
    e.preventDefault();

    if (!!handleValidation()) {
      setLoadingBtn(true);
      try {
        const response = await AxiosInstance.post("/bank-deposit", {
          category: bankData.category,
          bankName: bankData.bankName,
          accountName: bankData.accountName,
          accountNumber: bankData.accountNumber,
          qrisImage: bankData.qrisImage,
          minTransaction: parseFloat(bankData.minTransaction.replace(/,/g, "")),
          maxTransaction: parseFloat(bankData.maxTransaction.replace(/,/g, "")),
          uniqueCode: bankData.uniqueCode,
        });
        if (response.data.success) {
          setShowModal(false);
          setListData((prevListData) => [...prevListData, response.data.data]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingBtn(false);
      }
    }
  };

  const customButton = (
    <button
      onClick={() => handleCreateBank("create-bank")}
      className="btn btn-primary text-nowrap btn-sm rounded-1 me-1 mb-2 mb-md-0 w-md-auto"
    >
      Create Bank
    </button>
  );

  const handleCategoryChange = (e) => {
    const categoryCode = e.target.value;
    const selectedCategory = listCategoryBank.find(
      (category) => category.code === categoryCode
    );

    if (selectedCategory) {
      setListBankName(selectedCategory.list);
      handleChange("category", categoryCode);
    }
  };

  const handleChange = (field, value) => {
    setBankData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleStatusChange = async (id, value, type) => {
    try {
      let statusValue;

      if (type === "status_bank") {
        statusValue = value;
      } else if (type === "show_bank") {
        statusValue = value;
      } else if (type === "show_form") {
        console.log(value);

        statusValue = value;
      }

      const response = await AxiosInstance.patch(`/bank-deposit/${id}/status`, {
        type: type,
        status: statusValue,
      });

      if (response && response.data) {
        const updatedShowBank = response.data.show_bank;
        setListData((prevState) =>
          prevState.map((bank) => {
            if (bank.id === id) {
              const updatedBank = { ...bank };
              if (type === "show_bank") {
                updatedBank.show_bank = updatedShowBank;
              } else if (type === "status_bank") {
                updatedBank.status_bank = statusValue;
              } else if (type === "show_form") {
                updatedBank.show_form = statusValue;
              }
              return updatedBank;
            }
            return bank;
          })
        );
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          limit: 3,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.delete(
        `/bank-deposit/${bankData.id}`
      );
      if (response.data.message) {
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          limit: 3,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setListData(listData.filter((bank) => bank.id !== bankData.id));
      }
    } catch (error) {
      console.error("Error deleting bank deposit:", error);
    } finally {
      setShowModalDelete(false);
      setLoadingBtn(false);
    }
  };

  const handleClickDelete = (bankId) => {
    const bankToEdit = listData.find((bank) => bank.id === bankId);

    if (bankToEdit) {
      setBankData({
        id: bankToEdit.id || "",
        category: bankToEdit.type || "",
        bankName: bankToEdit.bank_name || "",
        accountName: bankToEdit.account_name || "",
        accountNumber: bankToEdit.account_number || "",
        qrisImage: bankToEdit.qris_img || "",
        minTransaction: bankToEdit.min_deposit || "",
        maxTransaction: bankToEdit.max_deposit || "",
        uniqueCode: bankToEdit.unique_code || "",
      });
    }
    setShowModalDelete(true);
  };

  const tbody = (listData, columns, page, perPage) => {
    return listData.map((data, idx) => {
      return (
        <tr key={idx}>
          <td className="text-center">
            {(pageIndex - 1) * perPageIndex + idx + 1}
          </td>
          <td>
            {new Date(data.created_at)
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(",", " |")}
          </td>
          <td>{data.bank_name}</td>
          <td>{data.account_name}</td>
          <td>{data.account_number}</td>
          <td>
            {Number(data.min_deposit).toLocaleString()} -{" "}
            {Number(data.max_deposit).toLocaleString()}
          </td>
          <td>{data.unique_code ? data.unique_code : "none"}</td>
          <td>
            <select
              name="show_form"
              value={data.show_form}
              style={{ minWidth: "100px" }}
              onChange={(e) =>
                handleStatusChange(data.id, e.target.value, "show_form")
              }
              className="form-control form-control-sm has-arrow"
            >
              <option value="showAccNo">Show Account Number</option>
              <option value="showQris">Show Qris Image</option>
            </select>
          </td>
          <td>
            <select
              name="status_bank"
              value={data.status_bank}
              style={{ minWidth: "100px" }}
              onChange={(e) =>
                handleStatusChange(data.id, e.target.value, "status_bank")
              }
              className={`form-control form-control-sm has-arrow 
                                                ${
                                                  data.status_bank === "active"
                                                    ? "select-active"
                                                    : ""
                                                }
                                                ${
                                                  data.status_bank ===
                                                  "maintenance"
                                                    ? "select-maintenance"
                                                    : ""
                                                }
                                                ${
                                                  data.status_bank === "offline"
                                                    ? "select-offline"
                                                    : ""
                                                }`}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </td>
          <td>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={`statusBankDepositInForm-${data.id}`}
                checked={data.show_bank === "active"}
                onChange={(e) =>
                  handleStatusChange(
                    data.id,
                    e.target.checked ? "active" : "inactive",
                    "show_bank"
                  )
                }
              />
            </div>
          </td>
          <td className="text-end">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="eye-tooltip">Edit</Tooltip>}
            >
              <a
                role="button"
                className="btn btn-sm btn-link"
                onClick={() => handleEditBank("edit-bank", data.id)}
              >
                <FaEdit size={15} />
              </a>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="trash-tooltip">Delete</Tooltip>}
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
    });
  };

  const handleConfirmUpdateBanks = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.put(
        `/bank-deposit/${bankData.bankId}`,
        bankData
      );

      if (
        response.data &&
        response.data.message === "Bank deposit updated successfully"
      ) {
        const updatedBankData = response.data.data;

        setListData((prevListData) => {
          return prevListData.map((bank) =>
            bank.id === updatedBankData.id ? updatedBankData : bank
          );
        });
        setBankData({
          category: "",
          bankName: "",
          accountName: "",
          accountNumber: "",
          qrisImage: "",
          minTransaction: "",
          maxTransaction: "",
          uniqueCode: "",
        });

        setShowModal(false);
        setLoadingBtn(false);
      } else {
        setLoadingBtn(false);
      }
    } catch (error) {
      setLoadingBtn(false);
    }
  };

  return (
    <>
      <GenericTable
        listData={listData}
        columns={columns}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        page={page}
        loading={loading}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        customTbody={tbody}
        totalRecord={totalRecord}
        title="Bank Management"
        formInputs={["search", "perPage"]}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isFirstLoad={isFirstLoad}
        recordsFiltered={recordsFiltered}
        perPageIndex={perPageIndex}
        pageIndex={pageIndex}
        customButton={customButton}
      />
      <ModalBank
        onShow={showModal}
        onHide={handleCloseModal}
        modalTitle={modalTite}
        bankData={bankData}
        listCategoryBank={listCategoryBank}
        listBankName={listBankName}
        handleChange={handleChange}
        handleCategoryChange={handleCategoryChange}
        handleSubmit={
          actions === "edit-bank"
            ? handleConfirmUpdateBanks
            : handleSubmitCreateBank
        }
        errors={errors}
        loadingBtn={loadingBtn}
        actions={actions}
      />
      <ModalConfirm
        textInfo={{
          itemName: (
            <span className="text-danger fw-semibold">
              {bankData.bankName} - {bankData.accountName}
            </span>
          ),
          item: <span className="text-primary fw-semibold">Bank Deposit</span>,
          type: "delete"
        }}
        onShow={showModalDelete}
        onHide={handleCloseModal}
        handleConfirm={handleConfirmDelete}
        btnLoading={loadingBtn}
      />
    </>
  );
};

export default IndexBankManagement;
