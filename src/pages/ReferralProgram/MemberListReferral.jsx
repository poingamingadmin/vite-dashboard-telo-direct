import { useState, useEffect, useContext } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { FaTrash } from "react-icons/fa";
import { UserContext } from "../../contexts/UserContext";

const MemberListReferral = () => {
  const queryParams = new URLSearchParams(location.search);
  const referralId = queryParams.get("id");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [userDelete, setUserDelete] = useState([]);
  const { user } = useContext(UserContext);
  const endPoint = `/referral/${referralId}/user-list`;
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

  const isAllSelected =
    listData.length > 0 && selectedItems.length === listData.length;

  const handleSelectItem = (e, listDataSelected) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedItems((prev) => [...prev, listDataSelected]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((item) => item.id !== listDataSelected.id)
      );
    }
  };


  const handleBulkDeleteConfirm = async () => {
    const userReferralIds = selectedItems.map((referral) => referral.id);
    setBtnLoading(true);

    try {
      const response = await AxiosInstance.delete("/referrals/bulk-delete", {
        data: { user_referral_ids: userReferralIds },
      });

      if (response.data.success) {
        setListData((prevListData) =>
          prevListData.filter(
            (referral) => !userReferralIds.includes(referral.id)
          )
        );
        handleCloseModal();
        setSelectedCount(0);
        setSelectedItems([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setBtnLoading(true);
    try {
      const response = await AxiosInstance.delete(
        `/referrals/${userDelete[0]?.id}`
      );

      if (response.data.success) {
        setListData((prevListData) =>
          prevListData.filter(
            (referral) => referral.id !== userDelete[0]?.id
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };


  const handleBulkDeleteClick = () => {
    setIsBulkDelete(true);
    setShowModal(true);
  };

  const handleDeleteClick = (userId, username) => {
    setIsBulkDelete(false);
    setUserDelete([{ id: userId, username }]);
    setShowModal(true);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      setSelectedItems(listData);
    } else {
      setSelectedItems([]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filterList = [
    {
      name: "Users with Transactions",
      value: "with_transaction",
    },
    {
      name: "Users without Transactions",
      value: "without_transaction",
    },
  ];

  const totalFirstDepositAmount = listData.reduce((total, referral) => {
    const amount = parseFloat(referral.first_deposit_amount || 0);
    return total + amount;
  }, 0);


  const columns = [
    // Checkbox kolom (hilang jika SuperMarketing)
    ...(user?.role === 'SuperMarketing'
      ? []
      : [{
        name: (
          <input
            type="checkbox"
            className="form-check-input"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
        ),
        style: { textAlign: 'center' },
      }]
    ),

    { name: "No", style: { textAlign: "center" } },
    { name: "Referral Username", style: {} },
    { name: "User Username", style: {} },
    { name: "User Join Date", style: {} },
    { name: "First Deposit Date", style: {} },
    { name: "First Deposit Amount", style: {} },
    { name: "Total Deposit Count", style: {} },
    { name: "RDP Commission", style: {} },
    { name: "Total Commission", style: {} },
    ...(user?.role === 'SuperMarketing'
      ? []
      : [{
        name: "",
        style: { textAlign: "center" },
      }]
    )
  ];



  const tbody = (listData, columns, page, perPage) => {
    return listData.map((data, index) => (
      <tr key={index}>
        {user?.role === 'SuperMarketing' ? null : (<td className="text-center">
          <input
            type="checkbox"
            className="form-check-input form-check-sm"
            checked={selectedItems.some(
              (item) => item.id === data.id
            )}
            onChange={(e) => handleSelectItem(e, data)}
          />
        </td>)}
        <td className="text-center">{(page - 1) * perPage + index + 1}</td>
        <td className="fw-semibold">{data.referral?.user?.username || '-'}</td>
        <td className="fw-semibold text-primary">{data.user?.username || '-'}</td>
        <td>
          {data.user?.created_at
            ? new Date(data.user.created_at)
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(",", " |")
            : "-"}
        </td>
        <td>
          {data.first_deposit_at
            ? new Date(data.first_deposit_at)
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(",", " |")
            : "-"}
        </td>
        <td className="fw-semibold text-danger">
          {data.first_deposit_amount
            ? new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data.first_deposit_amount)
            : "-"}
        </td>
        <td className="text-center">{data.total_deposit_count ?? 0}</td>
        <td className="text-center">
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(data.rdp_commission_total || 0)}
        </td>
        <td className="text-center">
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(data.commission_earned || 0)}
        </td>
        {user?.role === "SuperMarketing" ? null : (
          <td className="text-center">
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip id="trash-tooltip">Delete</Tooltip>}
            >
              <Button
                className="btn btn-xs btn-link"
                role="button"
                onClick={() => handleDeleteClick(data.id, data.user?.username)}
              >
                <FaTrash color="red" />
              </Button>
            </OverlayTrigger>
          </td>
        )}
      </tr>
    ));
  };


  const customButton = selectedCount > 0 && (
    <button
      onClick={handleBulkDeleteClick}
      className="btn btn-outline-danger text-nowrap btn-sm rounded-1 me-1 mb-2 mb-md-0 w-md-auto"
    >
      DELETE ({selectedCount})
    </button>
  );

  useEffect(() => {
    setSelectedCount(selectedItems.length);
  }, [selectedItems]);

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
        title="Member List Referral"
        formInputs={["search", "perPage", "filter", "dateRange"]}
        listFilter={filterList}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isFirstLoad={isFirstLoad}
        recordsFiltered={recordsFiltered}
        perPageIndex={perPageIndex}
        pageIndex={pageIndex}
        customButton={customButton}
        totalAmount={totalFirstDepositAmount}
      />
      <ModalConfirm
        textInfo={{
          itemName: isBulkDelete ? (
            <span className="text-danger fw-semibold">
              {selectedCount} User{selectedCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-danger fw-semibold">
              {userDelete.length > 0
                ? userDelete[0]?.username
                : "No User Selected"}
            </span>
          ),
          item: <span className="text-primary fw-semibold">Referral</span>,
          type: "delete"
        }}
        onShow={showModal}
        onHide={handleCloseModal}
        isTextInputRequired={isBulkDelete}
        handleConfirm={
          isBulkDelete ? handleBulkDeleteConfirm : handleDeleteConfirm
        }
        btnLoading={btnLoading}
      />
    </>
  );
};

export default MemberListReferral;
