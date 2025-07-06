import { useState, useEffect, useContext } from "react";
import { Card, Table } from "react-bootstrap";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import { UserContext } from "../../contexts/UserContext";
import { useApiData } from '../../contexts/ApiDataContext';

const HomePages = () => {
  const { user } = useContext(UserContext);
  const data = useApiData();

  const [agentBalance, setAgentBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [expired, setExpired] = useState(null);
  const [isMt, setIsMt] = useState(null);

  useEffect(() => {
    if (data) {
      setAgentBalance(data.total_balance_agent || 0);
      setUserBalance(data.total_balance_user || 0);
      setExpired(data.exp || null);
      setIsMt(data.is_maintenance || null);
    }
  }, [data]);

  const expDate = new Date(expired || user?.exp);
  const today = new Date();
  const isExpired = today.getTime() >= expDate.getTime();


  const timeDiff = expDate.getTime() - today.getTime();

  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let textColor = "black";
  let displayText = formatDate(expDate);

  if (today.getTime() >= expDate.getTime()) {
    displayText = "EXPIRED";
    textColor = "#bdc3c7";
  } else if (daysDiff <= 3) {
    textColor = "#f39c12";
  }


  function formatDate(date) {
    return date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  }

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <>
      <Breadcrumb title="Dashboard Agent" />
      <Card className="rounded-0 shadow-sm">
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <Table
                bordered
                size="sm"
                style={{ width: "100%" }}
                className="text-nowrap align-middle"
              >
                <thead className="bg-dark">
                  <tr>
                    <th className="py-2" colSpan={2}>
                      <span style={{ marginLeft: "8px" }}>
                        My Personal Detail
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2" style={{ width: "35%" }}>
                      <span style={{ marginLeft: "8px" }}>Agent Code</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span style={{ marginRight: "8px" }}>
                        {user?.agent_code?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "35%" }}>
                      <span style={{ marginLeft: "8px" }}>Agent Balance</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span style={{ marginRight: "8px" }}>
                        {formatBalance(agentBalance)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "35%" }}>
                      <span style={{ marginLeft: "8px" }}>
                        Total User Balance
                      </span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span style={{ marginRight: "8px" }}>
                        {formatBalance(userBalance)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "35%" }}>
                      <span style={{ marginLeft: "8px" }}>Level</span>
                    </td>
                    <td className="fw-semibold text-end">
                      <span style={{ marginRight: "8px" }}>{user?.role}</span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="col-md-6">
              <Table
                bordered
                size="sm"
                style={{ width: "100%" }}
                className="text-nowrap align-middle"
              >
                <thead className="bg-dark">
                  <tr>
                    <th className="py-2" colSpan={2}>
                      <span style={{ marginLeft: "8px" }}>
                        My Website Detail
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2" style={{ width: "35%", textAlign: "left", paddingLeft: "8px" }}>
                      <span>Expired Date</span>
                    </td>
                    <td className="py-2 text-end fw-semibold" style={{ paddingRight: "8px" }}>
                      <span style={{ color: textColor }}>{displayText}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2" style={{ width: "35%", textAlign: "left", paddingLeft: "8px" }}>
                      <span>Status Website</span>
                    </td>
                    <td className="py-2 text-end fw-semibold" style={{ paddingRight: "8px" }}>
                      <span className={isExpired ? 'text-secondary' : isMt ? 'text-danger' : 'text-success'}>
                        {isExpired ? 'SUSPENDED' : isMt ? 'INACTIVE' : 'RUNNING'}
                      </span>
                    </td>
                  </tr>
                </tbody>

              </Table>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default HomePages;
