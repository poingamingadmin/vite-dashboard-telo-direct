import { useState, useEffect } from "react";
import useDataTable from "../../components/Tables/useDataTable";
import GenericTable from "../../components/Tables/GenericTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import UserModal from "../../components/Modals/UserModal";

const IndexMemberManagement = () => {
  const endPoint = "/users";
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);

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
      style: { width: "40px", textAlign: "center" },
    },
    {
      name: "Username",
      style: { width: "110px" },
    },
    {
      name: "Phone",
      style: { width: "140px" }, // cukup karena semua 11-13 digit
    },
    {
      name: "Bank Name",
      style: { width: "90px" }, // pendek saja, bank name selalu singkat
    },
    {
      name: "Account Name",
      style: { width: "220px" }, // cukup untuk nama panjang
    },
    {
      name: "Account Number",
      style: { width: "160px" }, // sesuai panjang rekening/gopay
    },
    {
      name: "Balance",
      style: { width: "90px" }, // angka sedikit
    },
    {
      name: "canLogin",
      style: { width: "90px", textAlign: "center" },
    },
    {
      name: "canPlayGame",
      style: { width: "110px", textAlign: "center" }, // label lebih panjang
    },
    {
      name: "IP Address",
      style: { width: "150px" }, // semua IP di bawah 16 karakter
    },
    {
      name: "Created Date",
      style: { width: "190px" }, // tanggal & jam
    },
    {
      name: "",
      style: { width: "40px", textAlign: "end" }, // icon edit
    },
  ];


  const filterList = [
    {
      name: "New Member",
      value: "new_member",
    },
    {
      name: "Have Balance",
      value: "have_balance",
    },
  ];

  const tbody = (listData, columns, page, perPage) => {
    return listData.map((data, idx) => (
      <tr key={idx}>
        <td className="text-center">
          {(pageIndex - 1) * perPageIndex + idx + 1}
        </td>
        <td>
          <span className="fw-semibold text-primary me-1">{data.username}</span>
          {data.transaction_tag === "NEW" ? (
            <span className="label-shape">NEW</span>
          ) : null}
        </td>
        <td>{data.phone}</td>
        <td>{data?.bank_name}</td>
        <td>{data?.account_name}</td>
        <td>{data?.account_number}</td>
        <td className="text-danger fw-semibold">
          {data.active_balance &&
            new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(data.active_balance)}
        </td>
        <td
          className={`text-center text-uppercase ${data.can_login ? "text-success" : "text-danger"
            }`}
        >
          {data.can_login ? "TRUE" : "FALSE"}
        </td>
        <td
          className={`text-center text-uppercase ${data.can_play_game ? "text-success" : "text-danger"
            }`}
        >
          {data.can_play_game ? "TRUE" : "FALSE"}
        </td>
        <td>{data.ip}</td>
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
        <td className="text-end">
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip id="trash-tooltip">Edit</Tooltip>}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleClickEdit(data.id);
              }}
              href="#"
              role="button"
              className="btn btn-xs btn-link"
            >
              <FiEdit size={16} />
            </button>
          </OverlayTrigger>
        </td>
      </tr>
    ));
  };

  const handleClickEdit = (id) => {
    const userData = listData.find((user) => user.id === id);

    setShowModal(true);
    setUserData(userData);
  };

  const updateListData = (updatedUserData) => {
    setListData((prevListData) =>
      prevListData.map((user) =>
        user.id === updatedUserData.id ? { ...user, ...updatedUserData } : user
      )
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        title="Member Management"
        formInputs={["search", "dateRange", "filter", "perPage"]}
        dateRange={dateRange}
        setDateRange={setDateRange}
        listFilter={filterList}
        isFirstLoad={isFirstLoad}
        recordsFiltered={recordsFiltered}
        perPageIndex={perPageIndex}
        pageIndex={pageIndex}
      />
      <UserModal
        onShow={showModal}
        handleCloseModal={handleCloseModal}
        userData={userData}
        updateUserData={(newData) => setUserData(newData)}
        updateListData={updateListData}
      />
    </>
  );
};

export default IndexMemberManagement;
