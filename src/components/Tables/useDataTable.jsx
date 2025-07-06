import { useState, useEffect } from "react";
import AxiosInstance from "../Api/AxiosInstance";

const useDataTable = (endPoint) => {
  const [listData, setListData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [recordsFiltered, setRecordsFiltered] = useState(0);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);
  const [perPageIndex, setPerPageIndex] = useState(25);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [dateRange, setDateRange] = useState([]);
  const [allListData, setAllListData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AxiosInstance.get(endPoint, {
        params: {
          search: search,
          filter: filter,
          page: page,
          length: perPage,
          daterange: dateRange,
        },
      });
      setListData(response.data.data);
      setTotalRecord(response.data.recordsTotal);
      setRecordsFiltered(response.data.recordsFiltered);
      setAllListData(response.data);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setIsFirstLoad(false);
      setLoading(false);
      setPageIndex(page);
      setPerPageIndex(perPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, filter, page, perPage, dateRange]);

  return {
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
  };
};

export default useDataTable;
