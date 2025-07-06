import { useEffect, useState, useContext } from "react";
import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";
import BankLogo from "../../components/BankLogo";
import Pusher from "pusher-js";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import AxiosInstance from "../../components/Api/AxiosInstance";
import Loader from "rsuite/Loader";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";

const Deposit = () => {
  const [formData, setFormData] = useState({});
  const [loadingTransaction, setLoadingTransaction] = useState(null);
  const { user } = useContext(UserContext);
  const endPoint = "/deposit";
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
    setTotalRecord,
    dateRange,
    setDateRange,
    isFirstLoad,
    recordsFiltered,
    setRecordsFiltered,
    pageIndex,
    perPageIndex,
    allListData,
  } = useDataTable(endPoint);

  const columns = [
    {
      name: "#",
      style: { textAlign: "center" },
    },
    {
      name: "Date Transaction",
      style: {},
    },
    {
      name: "Username",
      style: {},
    },
    {
      name: "Sender Bank",
      style: {},
    },
    {
      name: "Recipient Bank",
      style: {},
    },
    {
      name: "Amount",
      style: { textAlign: "end" },
    },
    {
      name: "Bonus",
      style: {},
    },
    {
      name: "Note/Remarks",
      style: {},
    },
    {
      name: "",
      style: { textAlign: "end" },
    },
  ];

  const handleInputChange = (e, transactionId, field) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [transactionId]: {
        ...prevData[transactionId],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (deposit_id) => {
    setLoadingTransaction({ id: deposit_id, action: "approve" });
    try {
      const { bonus, note } = formData[deposit_id] || {};

      await AxiosInstance.post("/deposit", {
        deposit_id,
        bonus,
        note,
        action: "Approved",
      });

      setListData((prevListData) =>
        prevListData.filter((listData) => listData.id !== deposit_id)
      );
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "bottom-left",
        autoClose: 5000,
        limit: 3,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoadingTransaction(null);
    }
  };

  const handleReject = async (deposit_id) => {
    setLoadingTransaction({ id: deposit_id, action: "reject" });

    try {
      const { note } = formData[deposit_id] || {};

      await AxiosInstance.post("/deposit", {
        deposit_id,
        note,
        action: "Rejected",
      });

      setListData((prevListData) =>
        prevListData.filter((listData) => listData.id !== deposit_id)
      );
    } catch (error) {
      console.error("Error rejecting deposit:", error);
    } finally {
      setLoadingTransaction(null);
    }
  };

  const tbody = (listData, columns, page, perPage) => {
    return listData.map((data, idx) => {
      const transactionId = data.id;
      const { bonus = "", note = "" } = formData[transactionId] || {};
      const isLoading = loadingTransaction?.id === transactionId;
      const isApproved =
        loadingTransaction?.action === "approve" &&
        loadingTransaction?.id === transactionId;
      const isRejected =
        loadingTransaction?.action === "reject" &&
        loadingTransaction?.id === transactionId;
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
          <td>
            <span className="fw-semibold text-primary me-1">
              {data.user?.username}
            </span>
            {data.new_tag === "NEW" ? (
              <span className="label-shape">NEW</span>
            ) : null}
          </td>
          <td>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BankLogo bankName={data.sender_bank_name} />
              <span style={{ marginLeft: "0", fontWeight: "600" }}>
                {data.sender_account_name}
              </span>
            </div>
          </td>
          <td>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BankLogo bankName={data.recipient_bank_name} />
              <span style={{ marginLeft: "0", fontWeight: "600" }}>
                {data.recipient_account_name}
              </span>
            </div>
          </td>
          <td className="text-end">
            <span className="text-danger fw-semibold">
              {data.amount &&
                new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(data.amount)}
            </span>
          </td>
          <td className="text-center">
            <select
              value={String(bonus)}
              style={{ minWidth: "150px" }}
              onChange={(e) => handleInputChange(e, transactionId, "bonus")}
              className="form-control form-control-sm has-arrow"
            >
              <option value="">Select Bonus</option>
              {allListData.bonusList &&
                allListData.bonusList.map((bonusItem) => (
                  <option key={bonusItem.id} value={bonusItem.id}>
                    {bonusItem.name}
                  </option>
                ))}
            </select>
          </td>
          <td>
            <input
              value={note}
              onChange={(e) => handleInputChange(e, transactionId, "note")}
              className="form-control form-control-sm"
              style={{ minWidth: "150px" }}
            />
          </td>
          <td className="text-center" style={{ padding: "2px", margin: "2px" }}>
            <div className="d-flex justify-content-center gap-1">
              <button
                className="btn btn-primary btn-sm rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "33px", height: "33px" }}
                onClick={() => handleApprove(data.id)}
                disabled={isLoading || isRejected}
              >
                {isLoading && isApproved ? <Loader size="sm" /> : <FaCheck />}
              </button>
              <button
                className="btn btn-danger btn-sm rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "33px", height: "33px" }}
                onClick={() => handleReject(data.id)}
                disabled={isLoading || isApproved}
              >
                {isLoading && isRejected ? <Loader size="sm" /> : <FaXmark />}
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    const initialFormData = listData.reduce((acc, transaction) => {
      acc[transaction.id] = {
        bonus: transaction.bonus_id || "",
        note: transaction.note || "",
      };
      return acc;
    }, {});
    setFormData(initialFormData);
  }, [listData]);

  useEffect(() => {
    const pusher = new Pusher(`${user.pusher_key}`, {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("my-channel");

    channel.bind("my-event-deposit", function (data) {
      setTotalRecord((prevTotalRecord) => prevTotalRecord + 1);
      setRecordsFiltered((prevRecordsFiltered) => prevRecordsFiltered + 1);
      setListData((prevListData) => {
        return [...prevListData, data];
      });
    });

    channel.bind("deposit-status", function (data) {
      toast.success(
        `Deposit ID ${data.transaction_id} has ${data.status} by ${data.admin}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          limit: 3,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );

      setTotalRecord((prevTotalRecord) => prevTotalRecord - 1);
      setRecordsFiltered((prevRecordsFiltered) => prevRecordsFiltered - 1);

      setListData((prevListData) => {
        return prevListData.filter((item) => item.id !== data.transaction_id);
      });
    });

    return () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);

  return (
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
      title="Deposit Transactions"
      formInputs={["search", "perPage"]}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isFirstLoad={isFirstLoad}
      recordsFiltered={recordsFiltered}
      perPageIndex={perPageIndex}
      pageIndex={pageIndex}
    />
  );
};

export default Deposit;
