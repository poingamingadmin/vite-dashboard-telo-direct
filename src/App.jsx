import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layouts/Layout";
import { toast, ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/UserContext";
import Preloader from "./components/Loader/Preloader";
import { useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";
import Pusher from "pusher-js";

function App() {
  return (
    <UserProvider>
      <AppWithLoading />
    </UserProvider>
  );
}

const AppWithLoading = () => {
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <Preloader title="Loading..." />;
  }

  return (
    <>
      <Layout>
        <AppRoutes />
      </Layout>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        limit={3}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
