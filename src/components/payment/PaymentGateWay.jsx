import React, { useEffect, useState } from "react";
import ModelTemplate from "./ModalTemplate";
import { FaCreditCard } from "react-icons/fa";
import Cansel from "../../assets/cansel.svg";
import { useDispatch, useSelector } from "react-redux";
import { processPayment } from "../../services/apiService";
import showToast from "../../utils/toastNotifications";
import { userLogout } from "../../store";
import { io } from "socket.io-client";

const PaymentGateWay = ({
  setOpenPaymentModal,
  totalAmount,
  scheduleId,
  seatProcessing,
  setSeatProcessing,
  setTotalAmount,
  setBookingSuccess,
}) => {
  const socket = io("http://localhost:5000");
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // Form states
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    securityCode: "",
    paymentType: "Credit Card",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.cardName.trim())
      newErrors.cardName = "Name on card is required.";
    if (!/^\d{16}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!formData.expiryMonth)
      newErrors.expiryMonth = "Expiry month is required.";
    if (!formData.expiryYear) newErrors.expiryYear = "Expiry year is required.";
    if (!/^\d{3}$/.test(formData.securityCode))
      newErrors.securityCode = "Security code must be 3 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handlePayNow = async () => {
    if (validateForm()) {
      const { paymentType } = formData;

      const paymentData = {
        userId: currentUser._id,
        scheduleId,
        seats: seatProcessing,
        paymentMethod: paymentType,
        amount: totalAmount,
      };

      try {
        setLoading(true);
        const response = await processPayment(paymentData);
        if (response) {
          showToast("success", response.message);
          socket.emit("multipleSeatsBooked", {
            scheduleId,
            seats: seatProcessing,
          });
          setBookingSuccess(true);
          setSeatProcessing([]);
          setTotalAmount(0);
        }
        setOpenPaymentModal(false);
      } catch (error) {
        const { error: response } = error;
        if (
          response?.message === "Token expired" &&
          response?.statusCode === 401
        ) {
          showToast("error", "Token expired. Please log in again.");
          localStorage.removeItem("token");
          dispatch(userLogout());
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
          return;
        } else {
          showToast("error", response?.message);
        }
      }
      setLoading(false);
    }
  };

  return (
    <ModelTemplate>
      <div
        className="relative w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700"
        style={{ maxWidth: "600px" }}
      >
        <button
          onClick={() => setOpenPaymentModal(false)}
          className="absolute text-gray-500 top-[22px] right-[22px] hover:text-gray-800 "
        >
          <img src={Cansel} alt="close" />
        </button>
        <div className="w-full pt-1 pb-5">
          <div className="bg-indigo-500 text-white overflow-hidden rounded-full w-20 h-20 -mt-16 mx-auto shadow-lg flex justify-center items-center">
            <FaCreditCard className="text-3xl" />
          </div>
        </div>
        <div className="mb-10">
          <h1 className="text-center font-bold text-xl uppercase">
            Secure payment info
          </h1>
        </div>
        <div className="mb-3 flex -mx-2">
          <div className="px-2">
            <label htmlFor="type1" className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-500"
                name="paymentType"
                value="visa"
                checked={formData.paymentType === "Credit Card"}
                onChange={handleChange}
              />
              <img
                alt="visa"
                src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                className="h-8 ml-3"
              />
            </label>
          </div>
          <div className="px-2">
            <label htmlFor="type2" className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-500"
                name="paymentType"
                value="paypal"
                checked={formData.paymentType === "Paypal"}
                onChange={handleChange}
              />
              <img
                alt="paypal"
                src="https://www.sketchappsources.com/resources/source-image/PayPalCard.png"
                className="h-8 ml-3"
              />
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label className="font-bold text-sm mb-2 ml-1">Name on card</label>
          <div>
            <input
              className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="John Smith"
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
            />
            {errors.cardName && (
              <p className="text-red-500 text-sm">{errors.cardName}</p>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label className="font-bold text-sm mb-2 ml-1">Card number</label>
          <div>
            <input
              className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="0000 0000 0000 0000"
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">{errors.cardNumber}</p>
            )}
          </div>
        </div>
        <div className="mb-3 -mx-2 flex items-end">
          <div className="px-2 w-1/2">
            <label className="font-bold text-sm mb-2 ml-1">
              Expiration month
            </label>
            <select
              className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={String(index + 1).padStart(2, "0")}>
                  {String(index + 1).padStart(2, "0")} -{" "}
                  {new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            {errors.expiryMonth && (
              <p className="text-red-500 text-sm">{errors.expiryMonth}</p>
            )}
          </div>
          <div className="px-2 w-1/2">
            <label className="font-bold text-sm mb-2 ml-1">
              Expiration year
            </label>
            <select
              className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.expiryYear && (
              <p className="text-red-500 text-sm">{errors.expiryYear}</p>
            )}
          </div>
        </div>
        <div className="mb-10">
          <label className="font-bold text-sm mb-2 ml-1">Security code</label>
          <div>
            <input
              className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="000"
              type="text"
              name="securityCode"
              value={formData.securityCode}
              onChange={handleChange}
            />
            {errors.securityCode && (
              <p className="text-red-500 text-sm">{errors.securityCode}</p>
            )}
          </div>
        </div>
        <div>
          <button
            disabled={seatProcessing.length === 0 || loading}
            className={`block w-full ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            } max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold`}
            onClick={handlePayNow}
          >
            <i className="mdi mdi-lock-outline mr-1"></i> PAY NOW
          </button>
        </div>
      </div>
    </ModelTemplate>
  );
};

export default PaymentGateWay;
