import React from "react";
import ModalTemplate from "./ModalTemplate";
import Cansel from "../../assets/cansel.svg";

const ProceedPopUp = ({
  setOpenPaymentModal,
  setOpenConfirmModal,
}) => {
  return (
    <ModalTemplate>
      <div className="bg-white px-[40px] pt-[26px] rounded-lg shadow-lg  w-[340px] relative">
        <button
          onClick={() => setOpenConfirmModal(false)}
          className="absolute text-gray-500 top-[22px] right-[22px] hover:text-gray-800 "
        >
          <img src={Cansel} alt="close" />
        </button>

        <p className="text-center text-[18px] font-bold text-[#000000]">
          Proceed to Payment
        </p>

        <p className="text-center text-[12px] text-[#5D7285] mt-[7px]">
          Are you booking multiple seats or proceeding to payment?
        </p>

        <div className="flex flex-col-reverse min-[369px]:flex-row   gap-4 mt-[38px] mb-[19px] w-full min-w-[214px] ">
          <button
            onClick={() => setOpenConfirmModal(false)}
            className="w-full h-[42px] h-vh  px-5 py-2 text-[#DD4124] border border-red-500 rounded-md hover:bg-red-50 font-medium text-[12px]"
          >
            Another Booking
          </button>
          <button
            onClick={() => {
              setOpenPaymentModal(true);
              setOpenConfirmModal(false);
            }}
            className="w-full h-[42px]   px-5 py-2 text-white bg-[#DD4124] rounded-md hover:bg-red-600 font-medium text-[12px]"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default ProceedPopUp;
