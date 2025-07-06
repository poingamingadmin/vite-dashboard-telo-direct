import { useState, useEffect, useContext } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import UserDropdown from "./UserDropdown";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import DepositSound from "../../assets/Sound/DepositSound.mp3";
import WithdrawalSound from "../../assets/Sound/WithdrawalSound.mp3";
import VerticalMenu from "./VerticalMenu";
import { useApiData } from "../../contexts/ApiDataContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const data = useApiData();

  const [agentBalance, setAgentBalance] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getCurrentTime = () => {
    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const currentTime = new Date().toLocaleString("en-US", options);
    return currentTime;
  };

  useEffect(() => {
    if (data) {
      setAgentBalance(data.total_balance_agent || 0);
    }
  }, [data]);

  const playNotificationSound = (type) => {
    const audio = new Audio(type);
    audio.play();
  };

  useEffect(() => {
    if (!user?.pusher_key) return;

    const pusher = new Pusher(user.pusher_key, {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("my-channel");

    channel.bind("my-event-deposit", function (data) {
      playNotificationSound(DepositSound);
      toast.info(
        <div>
          <div>
            <span>You have a new deposit!</span>
          </div>
          <div>
            <span className="fw-semibold">{data.user.username}</span> amount{" "}
            <span className="fw-semibold text-danger">
              {parseFloat(data.amount).toLocaleString("id-ID")}
            </span>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          limit: 3,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    });

    channel.bind("my-event-withdraw", function (data) {
      playNotificationSound(WithdrawalSound);
      toast.info(
        <div>
          <div>
            <span>You have a new withdrawal!</span>
          </div>
          <div>
            <span className="fw-semibold">{data.user.username}</span> amount{" "}
            <span className="fw-semibold text-danger">
              {parseFloat(data.amount).toLocaleString("id-ID")}
            </span>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          limit: 3,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [user?.pusher_key]);

  return (
    <header className="topbar card bg-topbar rounded-0 border-0 mw-auto">
      <div className="with-vertical">
        <nav className="navbar navbar-expand-lg px-3 py-0">
          <ul className="navbar-nav ps-xl-3">
            <li className="nav-item">
              <VerticalMenu />
            </li>
          </ul>
          <div className="d-flex align-items-center justify-content-between">
            <ul className="navbar-nav flex-row mx-auto align-items-center justify-content-center">
              <UserDropdown logout={handleLogout} />
            </ul>
          </div>
        </nav>
      </div>
      <div className="app-header with-horizontal">
        <nav className="navbar navbar-expand-xl container-fluid p-0 mw-100">
          <ul className="navbar-nav">
            <li className="nav-item d-none d-xl-block">
              <div className="brand-logo d-flex align-items-center justify-content-between ps-lg-3">
                <a
                  href="/"
                  className="text-nowrap logo-img d-flex align-items-center gap-1"
                >
                  <span className="logo-text">
                    {user?.logo && (
                      <img
                        src={user.logo}
                        alt="logo"
                        className="img-fluid dark-logo ps-2"
                        style={{ maxHeight: "70px", width: "auto" }}
                      />
                    )}
                  </span>
                </a>
              </div>
            </li>
          </ul>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <div className="d-flex align-items-center justify-content-between">
              <ul className="navbar-nav flex-row mx-auto align-items-center justify-content-center">
                <li className="nav-item d-flex align-items-center gap-3">
                  <div className="text-end">
                    <h5 className="d-block mb-0" style={{ color: "#cca515" }}>
                      Have any problem?
                      <a
                        style={{ color: "#cca515", marginLeft: "3px" }}
                        href="https://t.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Telegram <FaTelegramPlane className="mb-1" size={20} />
                      </a>
                    </h5>
                    <span className="text-white">
                      (TIME ZONE GMT +7) {getCurrentTime()}
                    </span>
                  </div>
                  <div className="mx-1"></div>
                  <div className="text-start">
                    <h6 className="d-block text-white">
                      Welcome agent,{" "}
                      <span className="fw-semibold">
                        {user?.username?.toUpperCase()}
                      </span>
                    </h6>
                    <span className="badge fw-semibold text-bg-danger">
                      Current Balance:{" "}
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(agentBalance)}
                    </span>
                  </div>
                  <div
                    className="mx-2"
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "40px",
                      backgroundColor: "white",
                      margin: "0 10px",
                    }}
                  ></div>
                  <UserDropdown logout={handleLogout} />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;