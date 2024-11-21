import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  return (
    <>
      <Header />
      <main>
        <div className=" mt-[70px]">
          <Outlet />
        </div>
      </main>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Root;
