import GenericTable from "../../components/Tables/GenericTable";
import useDataTable from "../../components/Tables/useDataTable";

const UserWinLose = () => {
  const queryParams = new URLSearchParams(location.search);
  const playerToken = queryParams.get("player_token");
  const start = queryParams.get("start");
  const end = queryParams.get("end");
  const endPoint = `/reports/win-lose/${playerToken}/history?start=${start}&end=${end}`;
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
      name: "User Code",
      style: {},
    },
    {
      name: "Provider Code",
      style: {},
    },
    {
      name: "Game Code",
      style: {},
    },
    {
      name: "Type",
      style: {},
    },
    {
      name: "Bet Money",
      style: {},
    },
    {
      name: "Win Money",
      style: {},
    },
    {
      name: "User Start Balance",
      style: {},
    },
    {
      name: "User End Balance",
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
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(/\//g, "-")
              .replace(",", "")}
          </td>
          <td>{data.user_code}</td>
          <td>{data.provider_code}</td>
          <td>{data.game_code}</td>
          <td>{data.type.toUpperCase()}</td>
          <td>{data.bet_money.toLocaleString()}</td>
          <td>{data.win_money.toLocaleString()}</td>
          <td>{data.user_start_balance.toLocaleString()}</td>
          <td>{data.user_end_balance.toLocaleString()}</td>
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
      title="Game History"
      formInputs={["perPage"]}
      dateRange={dateRange}
      setDateRange={setDateRange}
      isFirstLoad={isFirstLoad}
      recordsFiltered={recordsFiltered}
      perPageIndex={perPageIndex}
      pageIndex={pageIndex}
    />
  );
};

export default UserWinLose;
