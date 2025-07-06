/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import AxiosInstance from "../../components/Api/AxiosInstance";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import { Card, Col, Row, Table } from "react-bootstrap";
import DatePicker from "rsuite/DatePicker";
import Loader from "rsuite/Loader";
import "rsuite/Loader/styles/index.css";
import "rsuite/DatePicker/styles/index.css";

const DailyReports = () => {
  const [dataDailyReports, setDataDailyRepors] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const formatRupiah = (number) => {
    const numeric = Number(number);
    if (isNaN(numeric)) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numeric);
  };

  const formatAngka = (number) => {
    const numeric = Number(number);
    if (isNaN(numeric)) return "-";
    return new Intl.NumberFormat("id-ID").format(numeric);
  };

  useEffect(() => {
    const getDailyReports = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("/reports/daily-reports", {
          params: {
            date: date,
          },
        });
        if (response.data.success) {
          setDataDailyRepors(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getDailyReports();
  }, [date]);
  return (
    <>
      <Breadcrumb title="Daily Reports" />
      <Card className="rounded-0 shadow-sm">
        <Card.Header>
          <DatePicker
            placement="autoHorizontalStart"
            value={date}
            placeholder="Select Date"
            format="dd MMM yyyy"
            character=" - "
            onChange={setDate}
          />
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Table
                bordered
                style={{ width: "100%" }}
                className="align-middle table-sm-custom"
              >
                <thead className="bg-dark">
                  <tr>
                    <th className="py-2" colSpan={3}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Users</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total User Registration Deposit</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(
                            dataDailyReports.users_with_approved_deposits
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total User Registration Non-Deposit</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(
                            dataDailyReports.users_without_approved_deposits
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total User Registration from Referral</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(
                            dataDailyReports.users_without_approved_deposits
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total User Registration</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_user)
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table
                bordered
                style={{ width: "100%" }}
                className="align-middle table-sm-custom"
              >
                <thead className="bg-dark">
                  <tr>
                    <th className="py-2" colSpan={3}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Promotions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Claims</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_bonus_claims)
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Amount Claims</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatRupiah(dataDailyReports.total_amount_claims)
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <Table
                bordered
                style={{ width: "100%" }}
                className="align-middle table-sm-custom"
              >
                <thead className="bg-dark">
                  <tr>
                    <th className="py-2" colSpan={3}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Transactions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Approved Deposits</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_deposit_approved)
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Rejected Deposits</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_deposit_rejected)
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Approved Withdrawals</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_withdraw_approved)
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Rejected Withdrawals</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatAngka(dataDailyReports.total_withdraw_rejected)
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Amount Deposited (Approved)</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatRupiah(
                            dataDailyReports.total_deposit_amount_approved
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Amount Deposited (Rejected)</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatRupiah(
                            dataDailyReports.total_deposit_amount_rejected
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Amount Withdrawn (Approved)</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatRupiah(
                            dataDailyReports.total_withdraw_amount_approved
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "40%" }}>
                      <span>Total Amount Withdrawn (Rejected)</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span>
                        {loading ? (
                          <Loader size="xs" />
                        ) : (
                          formatRupiah(
                            dataDailyReports.total_withdraw_amount_rejected
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DailyReports;
