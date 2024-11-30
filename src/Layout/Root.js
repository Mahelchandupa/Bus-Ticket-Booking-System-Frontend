import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Root = () => {

  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  return (
    <>
      <Header />
      <main>
        <div className=" mt-[70px]">
          <Outlet context={{ setOpenPaymentModal, openPaymentModal }}/>
        </div>
      </main>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Root;
