import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import PaymentGateWay from "../components/payment/PaymentGateWay";

const Root = () => {

  const [openPaymentModal, setOpenPaymentModal] = useState(true);

  return (
    <>
      <Header />
      <main>
        <div className=" mt-[70px]">
          <Outlet />


          {
            openPaymentModal && (
              <PaymentGateWay setOpenPaymentModal={setOpenPaymentModal} />
            )
          }
        </div>
      </main>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Root;
