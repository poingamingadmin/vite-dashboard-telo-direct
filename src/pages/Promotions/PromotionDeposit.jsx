import useDataTable from "../../components/Tables/useDataTable";
import GenericTable from "../../components/Tables/GenericTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState } from "react";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import ModalPromotionDeposit from "../../components/Modals/ModalPromotionDeposit";
import AxiosInstance from "../../components/Api/AxiosInstance";

const PromotionDeposit = () => {
  const endPoint = "/promotions/deposit";
  const [bonusData, setBonusData] = useState({
    bonusName: "",
    typeBonus: "",
    amountBonus: "",
    categoryUser: "",
    targetType: "",
    maxClaims: "",
    minTransaction: "",
    targetTOWO: "",
    maxAmountBonus: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTite, setModalTitle] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [actions, setActions] = useState("");
  const {
    listData,
    setListData,
    loading,
    error,
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
      name: "Bonus Name",
      style: {},
    },
    {
      name: "Type Bonus",
      style: {},
    },
    {
      name: "Category Member",
      style: {},
    },
    {
      name: "Target Type",
      style: {},
    },
    {
      name: "Bonus Amount",
      style: {},
    },
    {
      name: "Max Claims",
      style: {},
    },
    {
      name: "Max Bonus",
      style: {},
    },
    {
      name: "Min Deposit",
      style: {},
    },
    {
      name: "Target TO/WD",
      style: {},
    },
    {
      name: "Description",
      style: {},
    },
    {
      name: "",
      style: { textAlign: "end" },
    },
  ];

  const customButton = (
    <button
      onClick={() => handleshowModal("create-bonus")}
      className="btn btn-primary text-nowrap btn-sm rounded-1 me-1 mb-2 mb-md-0 w-md-auto"
    >
      Create Promotions
    </button>
  );

  const handleValidation = () => {
    const newErrors = {};

    if (!bonusData.bonusName) {
      newErrors.bonusName = "Name is required";
    }

    if (!bonusData.typeBonus) {
      newErrors.typeBonus = "Type Bonus is required";
    }

    if (!bonusData.amountBonus) {
      newErrors.amountBonus = "Amount is required";
    } else {
      const amountBonusStr = String(bonusData.amountBonus);

      if (isNaN(amountBonusStr.replace(/[^\d]/g, ""))) {
        newErrors.amountBonus = "Amount must be a valid number";
      }
    }

    if (!bonusData.categoryUser) {
      newErrors.categoryUser = "Category User is required";
    }

    if (!bonusData.targetType) {
      newErrors.targetType = "Target Type is required";
    }

    if (!bonusData.maxClaims) {
      newErrors.maxClaims = "Max Claims is required";
    }

    if (!bonusData.minTransaction) {
      newErrors.minTransaction = "Min Transaction is required";
    } else {
      const minTransactionStr = String(bonusData.minTransaction);

      if (isNaN(minTransactionStr.replace(/[^\d]/g, ""))) {
        newErrors.minTransaction = "Min Transaction must be a valid number";
      }
    }

    if (bonusData.description && bonusData.description.length > 500) {
      newErrors.description = "Description should not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleshowModal = (type, idBonus) => {
    setActions(type);
    if (type === "create-bonus") {
      setModalTitle("Create Bonus Deposit");
      setBonusData({
        bonusName: "",
        typeBonus: "",
        amountBonus: "",
        categoryUser: "",
        targetType: "",
        maxClaims: "",
        minTransaction: "",
        maxAmountBonus: "",
        targetTOWO: "",
        description: "",
      });
      setShowModal(true);
    }
    if (type === "edit-bonus") {
      const bonusToEdit = listData.find((bonus) => bonus.id === idBonus);
      setModalTitle("Edit Bonus Deposit");
      setBonusData({
        bonusId: idBonus,
        bonusName: bonusToEdit.name,
        typeBonus: bonusToEdit.type,
        amountBonus: bonusToEdit.amount,
        categoryUser: bonusToEdit.category,
        targetType: bonusToEdit.condition_type,
        maxClaims: bonusToEdit.max_claims,
        maxAmountBonus: String(bonusToEdit.max_bonus),
        minTransaction: String(bonusToEdit.min_deposit),
        targetTOWO: bonusToEdit.target_turnover,
        description: bonusToEdit.description,
      });
      setShowModal(true);
    }
  };

  const handleConfirmCreateBonus = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    handleValidation();
    try {
      const response = await AxiosInstance.post(
        "promotions/deposit",
        bonusData
      );
      if (response.data && response.data.data) {
        setListData((prevListData) => [...prevListData, response.data.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
      setLoadingBtn(false);
    }
  };

  const handleConfirmEditBonus = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    handleValidation();

    try {
      const response = await AxiosInstance.put(
        `promotions/deposit/${bonusData.bonusId}`,
        bonusData
      );

      if (response.data.success) {
        setListData((prevListData) =>
          prevListData.map((item) =>
            item.id === bonusData.bonusId
              ? { ...item, ...response.data.data }
              : item
          )
        );
      } else {
        console.error("Update failed: ", response.data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      handleCloseModal();
      setLoadingBtn(false);
    }
  };

  const handleConfirmDelete = async (e) => {
    setLoadingBtn(true);
    e.preventDefault();
    handleValidation();

    try {
      const response = await AxiosInstance.delete(
        `promotions/deposit/${bonusData.bonusId}`
      );

      if (response.status === 200) {
        setListData((prevListData) =>
          prevListData.filter((item) => item.id !== bonusData.bonusId)
        );
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      handleCloseModal();
      setLoadingBtn(false);
    }
  };

  const handleChange = (field, value) => {
    setBonusData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const tbody = () => {
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
          <td>{data.name}</td>
          <td>{data.type === "bonus_persen" ? "%" : "IDR"}</td>
          <td>{data.category === "all" ? "ALL MEMBER" : "NEW MEMBER"}</td>
          <td>{data.condition_type === "target_turnover" ? "TO" : "WO"}</td>
          <td>
            {data.type === "bonus_persen"
              ? `${data.amount}%`
              : `IDR ${data.amount.toLocaleString()}`}
          </td>
          <td>{data.max_claims}</td>
          <td>{data.max_bonus.toLocaleString()}</td>
          <td>{data.min_deposit.toLocaleString()}</td>
          <td>{data.target_turnover}x</td>
          <td>{data.description}</td>
          <td className="text-end">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="eye-tooltip">Edit</Tooltip>}
            >
              <a
                role="button"
                className="btn btn-sm btn-link"
                onClick={() => handleshowModal("edit-bonus", data.id)}
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

  const handleCloseModal = () => {
    setBonusData({
      bonusName: "",
      typeBonus: "",
      amountBonus: "",
      categoryUser: "",
      targetType: "",
      maxClaims: "",
      minTransaction: "",
      maxAmountBonus: "",
      targetTOWO: "",
      description: "",
    });
    setShowModal(false);
    setShowModalDelete(false);
  };

  const handleClickDelete = (idBonus) => {
    const bonusToEdit = listData.find((bonus) => bonus.id === idBonus);
    setBonusData({
      bonusId: idBonus,
      bonusName: bonusToEdit.name,
      typeBonus: bonusToEdit.type,
      amountBonus: bonusToEdit.amount,
      categoryUser: bonusToEdit.category,
      targetType: bonusToEdit.condition_type,
      maxClaims: bonusToEdit.max_claims,
      minTransaction: String(bonusToEdit.min_deposit),
      targetTOWO: bonusToEdit.target_turnover,
      description: bonusToEdit.description,
    });
    setShowModalDelete(true);
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
        title="Deposit Promotions"
        formInputs={["search", "perPage"]}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isFirstLoad={isFirstLoad}
        recordsFiltered={recordsFiltered}
        perPageIndex={perPageIndex}
        pageIndex={pageIndex}
        customButton={customButton}
      />
      <ModalConfirm
        textInfo={{
          itemName: (
            <span className="text-danger fw-semibold">
              {bonusData.bonusName}
            </span>
          ),
          item: <span className="text-primary fw-semibold">Bonus Deposit</span>,
          type: "delete"
        }}
        onShow={showModalDelete}
        onHide={handleCloseModal}
        handleConfirm={handleConfirmDelete}
        btnLoading={loadingBtn}
      />
      <ModalPromotionDeposit
        onShow={showModal}
        onHide={handleCloseModal}
        modalTitle={modalTite}
        bonusData={bonusData}
        handleChange={handleChange}
        handleSubmit={
          actions === "edit-bonus"
            ? handleConfirmEditBonus
            : handleConfirmCreateBonus
        }
        loadingBtn={loadingBtn}
        errors={errors}
        actions={actions}
      />
    </>
  );
};

export default PromotionDeposit;
