import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";
const PromotionsReports = () => {
  const endPoint = "/reports/promotions";
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
      name: "Transaction Date",
      style: {},
    },
    {
      name: "Bonus Name",
      style: {},
    },
    {
      name: "Username",
      style: {},
    },
    {
      name: "Amount Bonus",
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
          <td className="fw-semibold">{data.note}</td>
          <td className="text-primary fw-semibold">{data.user?.username}</td>
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
      setPerPage={setPerPage}
      customTbody={tbody}
      totalRecord={totalRecord}
      title="Reports Promotions"
      formInputs={["search", "perPage", "dateRange"]}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isFirstLoad={isFirstLoad}
      recordsFiltered={recordsFiltered}
      perPageIndex={perPageIndex}
      pageIndex={pageIndex}
    />
  );
};

export default PromotionsReports;
