import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";
import { FaBan, FaCheck, FaEdit, FaEye, FaList, FaTrash } from "react-icons/fa";
import AxiosInstance from "../../components/Api/AxiosInstance";
import ModalConfirm from "../../components/Modals/ModalConfirm";
import { useState } from "react";
import ModalDetail from "../../components/Modals/ModalDetail";
import ReferralDetail from "../../components/Modals/ReferralDetail";
import { FaX } from "react-icons/fa6";
import { toast } from "react-toastify";

const IndexReferralProgram = () => {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const endPoint = "/referral";
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
    allListData,
  } = useDataTable(endPoint);

  const columns = [
    { name: "#", style: { width: "5%", textAlign: "center" } },
    { name: "Join Date" },
    { name: "Username" },
    { name: "Referral Code" },
    { name: "Referral Balance" },
    { name: "NDP Commission Type" },
    { name: "NDP Commission" },
    { name: "RDP Commission Type" },
    { name: "RDP Commission" },
    { name: "Approved At" },
    { name: "Approved By" },
    { name: "Total Member", style: { textAlign: "center" } },
    { name: "Status", style: { textAlign: "center" } },
    { name: "Actions", style: { textAlign: "center", whiteSpace: "nowrap" } },
  ];

  const tbody = (listData, columns, page, perPage) => {
    return listData.map((data, index) => {
      return (
        <tr key={index}>
          <td className="text-center">
            {(pageIndex - 1) * perPageIndex + index + 1}
          </td>

          <td>
            {new Date(data.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }).replace(",", " |")}
          </td>

          <td className="fw-semibold text-primary">{data.username}</td>
          <td>{data.referral_code}</td>

          <td className="fw-semibold">
            {Number(data.referral_balance || 0).toLocaleString("id-ID", {
              minimumFractionDigits: 0,
            })}
          </td>

          <td>{data.commission_ndp_type?.toUpperCase()}</td>

          <td>
            {data.commission_ndp_type === "percent"
              ? `${parseFloat(data.commission_ndp_value || 0)}%`
              : Number(data.commission_ndp_value || 0).toLocaleString("id-ID", {
                minimumFractionDigits: 0,
              })}
          </td>

          <td>{data.commission_rdp_type?.toUpperCase()}</td>

          <td>
            {data.commission_rdp_type === "percent"
              ? `${parseFloat(data.commission_rdp_value || 0)}%`
              : Number(data.commission_rdp_value || 0).toLocaleString("id-ID", {
                minimumFractionDigits: 0,
              })}
          </td>

          <td>
            {data.approved_at
              ? new Date(data.approved_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).replace(",", " |")
              : "-"}
          </td>

          <td>{data.approved_by?.username || "-"}</td>

          <td className="text-center text-danger fw-semibold">
            {Number(data.referred_users_count || 0).toLocaleString()}
          </td>

          <td
            className={`text-center text-uppercase fw-semibold ${data.status === "active"
              ? "text-success"
              : data.status === "suspended"
                ? "text-danger"
                : "text-secondary"
              }`}
          >
            {data.status.toUpperCase()}
          </td>

          <td className="text-center" style={{ whiteSpace: "nowrap" }}>
            {data.status === "verify" ? (
              <>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Approve</Tooltip>}>
                  <a
                    role="button"
                    onClick={() => openApproveModal(data)}
                    className="btn btn-sm btn-link me-1"
                  >
                    <FaCheck color="green" />
                  </a>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Reject</Tooltip>}>
                  <a
                    role="button"
                    onClick={() => handleDeleteReject(data.referral_id)}
                    className="btn btn-sm btn-link me-1"
                  >
                    <FaX color="red" />
                  </a>
                </OverlayTrigger>
              </>
            ) : (
              <>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Member List</Tooltip>}>
                  <Link to={`/referral-program/member-list?id=${data.referral_id}`} className="btn btn-sm btn-link me-1">
                    <FaList />
                  </Link>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>View Details</Tooltip>}>
                  <a role="button" onClick={() => handleShowModalDetail(data.referral_id)} className="btn btn-sm btn-link me-1">
                    <FaEdit />
                  </a>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete</Tooltip>}>
                  <a role="button" onClick={() => handleShowModalDelete(data.referral_id)} className="btn btn-sm btn-link">
                    <FaTrash color="red" />
                  </a>
                </OverlayTrigger>
              </>
            )}
          </td>
        </tr>
      );
    });
  };

  const handleDeleteReject = async (referral_id) => {
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.delete(`/referral/${referral_id}`);
      if (response.data.success) {
        setListData((prevList) =>
          prevList.filter((referral) => referral.referral_id !== referral_id)
        );
        setShowModalReject(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReferral) return;
    setLoadingBtn(true);
    try {
      const response = await AxiosInstance.delete(
        `/referral/${selectedReferral.referral_id}`
      );
      if (response.data.success) {
        setListData((prevList) =>
          prevList.filter((referral) => referral.referral_id !== selectedReferral.referral_id)
        );
        setShowModalDelete(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReferral) return;
    setIsLoading(true);
    try {
      const res = await AxiosInstance.get(`/referral/${selectedReferral.referral_id}/approve`);
      if (res.data.success) {
        toast.success("Referral approved successfully!");
        setListData((prevList) =>
          prevList.map((item) =>
            item.referral_id === selectedReferral.referral_id
              ? { ...item, status: "active", approved_at: new Date().toISOString() }
              : item
          )
        );
      } else {
        toast.error("Gagal menyetujui referral.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowModalConfirm(false);
    }
  };

  const openApproveModal = (referral) => {
    setSelectedReferral(referral);
    setShowModalConfirm(true);
  };

  const handleCloseModal = () => {
    setSelectedReferral(null);
    setShowModalDelete(false);
    setShowModalDetail(false);
  };

  const handleShowModalDelete = (referral_id) => {
    const referral = listData.find((ref) => ref.referral_id === referral_id);
    setSelectedReferral(referral);
    setShowModalDelete(true);
  };

  const handleShowModalDetail = (referral_id) => {
    const referral = listData.find((ref) => ref.referral_id === referral_id);
    setSelectedReferral(referral);
    setShowModalDetail(true);
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
        title="Referral Program"
        formInputs={["search", "perPage"]}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isFirstLoad={isFirstLoad}
        recordsFiltered={recordsFiltered}
        perPageIndex={perPageIndex}
        pageIndex={pageIndex}
      />

      <ModalConfirm
        textInfo={{
          itemName: selectedReferral?.username || "Referral",
          item: "Referral",
          type: "Approve",
        }}
        onShow={showModalConfirm}
        onHide={() => setShowModalConfirm(false)}
        handleConfirm={handleApprove}
        btnLoading={isLoading}
      />

      <ModalConfirm
        textInfo={{
          itemName: selectedReferral?.username || "Referral",
          item: "Referral",
          type: "Delete",
        }}
        onShow={showModalDelete}
        onHide={() => setShowModalDelete(false)}
        handleConfirm={handleDelete}
        btnLoading={loadingBtn}
      />

      <ModalDetail
        onShow={showModalDetail}
        onHide={handleCloseModal}
        modalTitle="Referral Information"
        ModalContent={
          <ReferralDetail
            selectedReferral={selectedReferral}
            setShowModalDetail={setShowModalDetail}
            setListData={setListData}
          />
        }
      />

    </>
  );
};

export default IndexReferralProgram;
