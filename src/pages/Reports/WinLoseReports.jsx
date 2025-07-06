import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useDataTable from "../../components/Tables/useDataTable";
import GenericTable from "../../components/Tables/GenericTable";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const WinLoseReports = () => {
  const endPoint = "/reports/win-lose";
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

  const handleExport = () => {
    try {
      const csv = Papa.unparse(listData);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, "list-data-turnover.csv");
    } catch (error) {
      console.error("Error while exporting CSV:", error);
    }
  };

  const customButton = (
    <button
      onClick={handleExport}
      className="btn btn-outline-primary text-nowrap btn-sm rounded-1 me-1 mb-2 mb-md-0 w-md-auto"
    >
      EXPORT
    </button>
  );

  const columns = [
    {
      name: "#",
      style: { textAlign: "center" },
    },
    {
      name: "Date Priod",
      style: {},
    },
    {
      name: "Username",
      style: {},
    },
    {
      name: "User Code",
      style: {},
    },
    {
      name: "Total Bet",
      style: {},
    },
    {
      name: "Total Win",
      style: {},
    },
    {
      name: "Win/Lose",
      style: {},
    },
    {
      name: "",
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
          <td className="fw-semibold">{allListData.daterange}</td>
          <td className="fw-semibold text-primary">{data.uc.split("_")[1]}</td>
          <td className="fw-semibold">{data.uc}</td>
          <td className="fw-semibold">{data.ba?.toLocaleString()}</td>
          <td className="fw-semibold">{data.wa?.toLocaleString()}</td>
          <td className="fw-semibold">{data.sa?.toLocaleString()}</td>
          <td className="text-end">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="list-tooltip">History</Tooltip>}
            >
              <Link
                to={`/reports/win-lose/history?player_token=${data.uc}&start=${
                  allListData.daterange.split(" - ")[0]
                }&end=${allListData.daterange.split(" - ")[1]}`}
                role="button"
                className="btn btn-sm btn-link"
              >
                <FaHistory size={14} />
              </Link>
            </OverlayTrigger>
          </td>
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
      title="User Win/Lose Reports"
      formInputs={["search", "perPage", "dateRange"]}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isFirstLoad={isFirstLoad}
      recordsFiltered={recordsFiltered}
      perPageIndex={perPageIndex}
      pageIndex={pageIndex}
      customButton={customButton}
    />
  );
};

export default WinLoseReports;
