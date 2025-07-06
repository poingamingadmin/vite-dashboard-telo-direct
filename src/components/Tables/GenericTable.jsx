import { Table, Card } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Breadcrumb from "../Layouts/Breadcrumb";
import Loader from "rsuite/Loader";
import DateRangePicker from "rsuite/DateRangePicker";
import "rsuite/Loader/styles/index.css";
import "rsuite/DateRangePicker/styles/index.css";
import { debounce } from "lodash";
import Preloader from "../Loader/Preloader";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const GenericTable = ({
  listData,
  columns,
  search,
  setSearch,
  filter,
  setFilter,
  page,
  setPage,
  perPage,
  setPerPage,
  loading,
  customTbody,
  totalRecord,
  title,
  formInputs,
  dateRange,
  setDateRange,
  listFilter,
  customButton,
  isFirstLoad,
  recordsFiltered,
  pageIndex,
  perPageIndex,
  totalAmount,
}) => {
  const handleSearch = debounce((event) => {
    setSearch(event.target.value);
  }, 300);

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const totalData = recordsFiltered;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const disableFutureDates = (date) => {
    return date > today;
  };

  return (
    <div style={{ position: "relative", minHeight: "400px" }}>
      {isFirstLoad ? (
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 999,
          }}
        >
          <Preloader title={title} />
        </div>
      ) : (
        <>
          <Breadcrumb title={title} totalData={totalRecord} />
          <Card className="rounded-0 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <form
                id="searchForm"
                className="d-flex w-100 justify-content-between align-items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="d-flex align-items-start">
                  {formInputs.includes("search") && (
                    <div className="me-0 mb-2 mb-md-0 position-relative">
                      <input
                        type="text"
                        id="search"
                        name="search"
                        className="form-control form-control-sm"
                        placeholder="Search.."
                        onChange={handleSearch}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          right: "25px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "20px",
                          height: "20px",
                        }}
                      >
                        {loading && search ? (
                          <Loader
                            size="sm"
                            speed="slow"
                            style={{ position: "absolute" }}
                          />
                        ) : (
                          <FaMagnifyingGlass size={14} color="gray" />
                        )}
                      </div>
                    </div>
                  )}

                  {formInputs.includes("filter") && (
                    <div className="mb-2 mb-md-0 position-relative">
                      <select
                        id="filter"
                        name="filter"
                        className="form-control form-control-sm"
                        placeholder="Filter.."
                        style={{ minWidth: "150px" }}
                        onChange={handleFilter}
                      >
                        <option value="">Select Filter</option>
                        {listFilter.map((filter, index) => {
                          return (
                            <option key={index} value={filter.value}>
                              {filter.name}
                            </option>
                          );
                        })}
                      </select>
                      <div
                        className="position-absolute"
                        style={{
                          right: "25px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "20px",
                          height: "20px",
                        }}
                      >
                        {loading && filter ? (
                          <Loader
                            size="sm"
                            speed="slow"
                            style={{ position: "absolute" }}
                          />
                        ) : (
                          <FaFilter size={14} color="gray" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  {formInputs.includes("perPage") && (
                    <div className="me-1 mb-2 mb-md-0">
                      <select
                        id="perPage"
                        name="perPage"
                        className="form-control form-control-sm has-arrow"
                        value={perPage}
                        style={{ minWidth: "80px" }}
                        onChange={(e) => setPerPage(e.target.value)}
                      >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                        <option value="500">500</option>
                      </select>
                    </div>
                  )}

                  {formInputs.includes("dateRange") && (
                    <div className="me-1 mb-2 mb-md-0">
                      <DateRangePicker
                        placement="auto"
                        block
                        value={dateRange}
                        placeholder="Select Date"
                        format="dd MMM yyyy"
                        character=" - "
                        onChange={setDateRange}
                        shouldDisableDate={disableFutureDates}
                      />
                    </div>
                  )}

                  {customButton ? (
                    <div className="mb-2 mb-md-0">{customButton}</div>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </Card.Header>
            <Card.Body>
              <Table
                responsive
                hover
                size="sm"
                style={{ width: "100%" }}
                className="text-nowrap align-middle"
              >
                <thead className="bg-dark">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} style={col.style}>
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && listData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        <span>Loading...</span>
                      </td>
                    </tr>
                  ) : listData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        {search ? (
                          <span>Data not found for "{search}"</span>
                        ) : (
                          <span>No results available</span>
                        )}
                      </td>
                    </tr>
                  ) : customTbody ? (
                    customTbody(listData, columns, page, perPage)
                  ) : null}
                </tbody>
                {totalAmount ? (
                  <tfoot>
                    <tr>
                      <td colSpan={5}></td>
                      <td className="text-end fw-semibold">Total:</td>
                      <td className="fw-semibold text-success">
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalAmount)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                ) : (
                  ""
                )}
              </Table>
              <nav aria-label="Page navigation">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
                  <span className="text-muted mb-2 mb-md-0">
                    Showing{" "}
                    {((pageIndex - 1) * perPageIndex + 1).toLocaleString()} to{" "}
                    {Math.min(
                      pageIndex * perPageIndex,
                      totalData
                    ).toLocaleString()}{" "}
                    of {totalData.toLocaleString()} entries
                  </span>
                  <ul className="pagination mb-0">
                    {totalData > perPage && (
                      <li
                        className={`page-item ${
                          pageIndex === 1 ? "disabled" : ""
                        }`}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        <button className="btn page-link me-1 btn-sm rounded-1">
                          <MdOutlineNavigateBefore size={16} />
                        </button>
                      </li>
                    )}
                    {page < Math.ceil(totalData / perPage) && (
                      <li
                        className={`page-item ${
                          pageIndex === Math.ceil(totalData / perPageIndex)
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          setPage((prev) =>
                            Math.min(prev + 1, Math.ceil(totalData / perPage))
                          )
                        }
                      >
                        <button className="btn page-link me-1 btn-sm rounded-1">
                          <MdOutlineNavigateNext size={16} />
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default GenericTable;
