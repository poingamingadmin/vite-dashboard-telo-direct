import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";
import BankLogo from "../../components/BankLogo";
const TransactionReports = () => {
  const endPoint = "/reports/transactions";
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

  const filterList = [
    {
      name: "Deposit",
      value: "deposit",
    },
    {
      name: "Deposit Approved",
      value: "deposit_approved",
    },
    {
      name: "Deposit Rejected",
      value: "deposit_rejected",
    },
    {
      name: "Withdrawal",
      value: "withdrawal",
    },
    {
      name: "Withdrawal Approved",
      value: "withdrawal_approved",
    },
    {
      name: "Withdrawal Rejected",
      value: "withdrawal_rejected",
    },
  ];

  const columns = [
    {
      name: "#",
      style: { textAlign: "center" },
    },
    {
      name: "Transaction Date",
      style: {},
    },
    {
      name: "Type",
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
      style: {},
    },
    {
      name: "Status",
      style: {},
    },
    {
      name: "Admin",
      style: {},
    },
  ];

  

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
          <td
            className={`fw-semibold text-uppercase ${
              data.type === "Deposit" ? "text-success" : "text-danger"
            }`}
          >
            {data.type}
          </td>
          <td className="text-primary fw-semibold">{data.user?.username}</td>
          <td>
            <BankLogo bankName={data.sender_bank_name} />{" "}
            {data.sender_account_name}
          </td>
          <td>
            <BankLogo bankName={data.recipient_bank_name} />{" "}
            {data.recipient_account_name}
          </td>
          <td className="text-danger fw-semibold">
            {data.amount &&
              new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(data.amount)}
          </td>
          <td
            className={`fw-semibold text-uppercase ${
              data.status === "Approved" ? "text-success" : "text-danger"
            }`}
          >
            {data.status}
          </td>
          <td>{data.admin}</td>
        </tr>
      );
    });
  };

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
      listFilter={filterList}
      setPerPage={setPerPage}
      customTbody={tbody}
      totalRecord={totalRecord}
      title="Reports Transactions"
      formInputs={["search", "perPage", "dateRange", "filter"]}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isFirstLoad={isFirstLoad}
      recordsFiltered={recordsFiltered}
      perPageIndex={perPageIndex}
      pageIndex={pageIndex}
    />
  );
};

export default TransactionReports;
