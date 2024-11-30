import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import showToast from "../utils/toastNotifications";
import { fetchScheduleById } from "../services/apiService";
import busImg from "../assets/bus-img.jpg";
import ArrowImg from "../assets/arrow.png";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../store";
import io from "socket.io-client";
import PaymentGateWay from "../components/payment/PaymentGateWay";

const Booking = () => {
  const socket = io("http://localhost:5000");
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState({});
  const dispatch = useDispatch();
  const [seatStatus, setSeatStatus] = useState([]);
  const [seatProcessing, setSeatProcessing] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { openPaymentModal, setOpenPaymentModal } = useOutletContext();

  const { currentUser } = useSelector((state) => state.user);

  const fetchSchedule = async () => {
    try {
      const response = await fetchScheduleById(scheduleId);
      setSchedule(response.data);
      setSeatStatus(response.data.seatStatus);
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
  };

  useEffect(() => {
    fetchSchedule();
  }, [scheduleId]);

  const year = schedule?.date ? new Date(schedule.date).getFullYear() : "N/A";
  const month = schedule?.date
    ? String(new Date(schedule.date).getMonth() + 1).padStart(2, "0")
    : "N/A";
  const day = schedule?.date
    ? String(new Date(schedule.date).getDate()).padStart(2, "0")
    : "N/A";

  const formattedDate = schedule?.date
    ? `${year}-${month}-${day}`
    : "No date available";

  const handleSeatClick = (seat) => {
    if (seat.seatAvailableState !== "Available") {
      alert("This seat is not available.");
      return;
    }

    // Notify backend to set seat state to Processing
    socket.emit("multipleSeatsProcessing", {
      scheduleId,
      seats: [...seatProcessing, seat],
      userId: currentUser._id,
    });

    setSeatProcessing((prevSeats) => [...prevSeats, seat]);
    setTotalAmount((prevAmount) => prevAmount + schedule.fare);

    showToast(
      "info",
      `Seat ${seat.seatNumber} is reserved for you. Complete the payment in 10 minutes.`
    );
  };

  useEffect(() => {
    socket.on("seatStatusUpdate", (update) => {
      console.log("update", update);
      if (update.scheduleId === scheduleId) {
        setSeatStatus((prevStatus) => {
          // Create a map of updated seat statuses for quick lookup
          const updatedSeatsMap = new Map(
            update.seats.map((seat) => [seat.seatNumber, seat.state])
          );

          console.log("updatedSeatsMap", updatedSeatsMap);

          // Update the seat statuses
          return prevStatus.map((seat) =>
            updatedSeatsMap.has(seat.seatNumber)
              ? {
                  ...seat,
                  seatAvailableState: updatedSeatsMap.get(seat.seatNumber),
                }
              : seat
          );
        });
      }
    });

    return () => {
      socket.off("seatStatusUpdate");
    };
  }, [scheduleId]);

  useEffect(() => {
    // Listen for seat reset from backend
    socket.on("seatReset", (update) => {
      if (update.scheduleId === scheduleId) {
        setSeatStatus((prevStatus) =>
          prevStatus.map((seat) =>
            seat.seatNumber === update.seatNumber
              ? { ...seat, seatAvailableState: "Available" }
              : seat
          )
        );
      }
    });

    return () => {
      socket.off("seatReset");
    };
  }, [scheduleId, socket, setSeatStatus, seatStatus]);
  
  return (
    <div className=" mt-[100px] mb-[100px]">
      <div className=" max-w-6xl mx-auto">
        <div className=" w-full min-h-[200px] rounded-md overflow-hidden shadow-md">
          <div className=" font-poppins flex items-center justify-between bg-blue-500 px-4 py-2">
            <h1 className="text-lg font-bold text-white">
              {schedule?.fromCity} to {schedule?.toCity}
            </h1>
            <h2 className="text-lg font-bold text-white">{formattedDate}</h2>
          </div>
          <div className="px-4 py-4 flex items-start gap-4">
            <img
              src={busImg}
              alt="bus"
              className="w-60 rounded-md h-[170px] object-cover"
            />
            <div className="flex flex-1 flex-col h-[170px] justify-between">
              <div className=" grid grid-cols-4">
                <div className=" flex flex-col gap-3">
                  <div className=" flex flex-col">
                    <p className=" text-[14px] font-poppins text-slate-600 font-bold">
                      Departure
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule?.departureTime}
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Arrival
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule.arrivalTime}
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Estimated Time
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule.estimatedTime}
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col gap-3">
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Bus Rotue
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule?.busRouteType}
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[14px] font-poppins text-slate-600 font-bold">
                      Fare
                    </p>
                    <p className="text-lg font-extrabold">
                      LKR {schedule?.fare}
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col gap-3">
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Bus Type
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule?.busId?.busType}
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Bus No
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule?.busId?.busId}
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                      Bus Name
                    </p>
                    <p className="text-lg font-extrabold">
                      {schedule?.busId?.busName}
                    </p>
                  </div>
                </div>
                <div className=" bg-yellow-100 flex items-center justify-center rounded-md">
                  <div className=" flex flex-col">
                    <p className=" text-[14px] text-center text-slate-600 font-poppins font-bold">
                      Available Seats
                    </p>
                    <p className=" text-2xl text-center font-extrabold">
                      {schedule?.availableSeats}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex mt-5 justify-center gap-5">
        <div className="border-[1px] px-5 pb-5 rounded-lg">
          <h1 className="text-2xl font-bold text-center mt-3">Select a Seat</h1>
          <div className=" flex gap-6 items-center justify-center mt-3">
            <div className=" flex flex-col gap-1 items-center">
              <span className="w-6 h-6 bg-transparent border border-blue-500 inline-block rounded-md"></span>
              <span className=" text-[12px] font-poppins font-bold">
                Available
              </span>
            </div>
            <div className=" flex flex-col gap-1 items-center">
              <span className="w-6 h-6 bg-green-400 border inline-block rounded-md"></span>
              <span className=" text-[12px] font-poppins font-bold">
                Processing
              </span>
            </div>
            <div className=" flex flex-col gap-1 items-center">
              <span className="w-6 h-6 bg-red-500 border inline-block rounded-md"></span>
              <span className=" text-[12px] font-poppins font-bold">
                Booked
              </span>
            </div>
          </div>
          <div className=" flex gap-10 mt-5">
            <div className=" flex flex-col gap-10">
              {/* Right Side Seats */}
              <SeatDisplay
                schedule={seatStatus}
                handleSeatClick={handleSeatClick}
                startWith="R"
              />
              {/* Left Side Seats */}
              <SeatDisplay
                schedule={seatStatus}
                handleSeatClick={handleSeatClick}
                startWith="L"
              />
            </div>
            <div className=" ">
              <SeatDisplay
                schedule={seatStatus}
                handleSeatClick={handleSeatClick}
                startWith={"B"}
              />
            </div>
          </div>
        </div>
        <div className=" w-[400px] h-full border rounded-lg flex flex-col items-center py-3 px-3">
          <h1 className=" text-center font-bold text-[18px] mb-5">Route</h1>
          <div className=" w-full flex flex-col gap-10">
            {
              // Route Map
              schedule?.road?.map((route, index) => (
                <div className=" flex justify-between items-center">
                  <div className=" flex flex-col">
                    <p className=" text-[12px] font-poppins text-slate-600 font-bold">
                      From Town
                    </p>
                    <p className="text-[14px] font-bold">{route?.fromTown}</p>
                  </div>
                  <div>
                    <img src={ArrowImg} alt="arrow" className=" w-10 h-10" />
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[12px] font-poppins text-slate-600 font-bold">
                      To Town
                    </p>
                    <p className="text-[14px] font-bold">{route?.toTown}</p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[12px] font-poppins text-slate-600 font-bold">
                      Distance
                    </p>
                    <p className="text-[14px] font-bold">
                      {route?.distanceKm} KM
                    </p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[12px] font-poppins text-slate-600 font-bold">
                      Duration
                    </p>
                    <p className="text-[14px] font-bold">
                      {route.estimatedTime}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <button
        disabled={seatProcessing.length === 0}
        onClick={() => setOpenPaymentModal(true)}
        className={`absolute left-1/2 transform -translate-x-1/2 ${
          seatProcessing.length === 0
            ? " cursor-not-allowed"
            : " cursor-pointer"
        } `}
      >
        <div className=" flex items-center justify-center w-[200px] h-[50px] bg-[#DD4124] text-white rounded-md mt-5">
          <p className=" text-[14px] font-poppins font-bold">
            Proceed to Payment
          </p>
        </div>
      </button>

      {openPaymentModal && (
        <PaymentGateWay
          setOpenPaymentModal={setOpenPaymentModal}
          totalAmount={totalAmount}
          scheduleId={scheduleId}
          seatProcessing={seatProcessing}
          setSeatProcessing={setSeatProcessing}
          setTotalAmount={setTotalAmount}
          setSeatStatus={setSeatStatus}
          seatStatus={seatStatus}
          setBookingSuccess={setBookingSuccess}
        />
      )}
    </div>
  );
};

export default Booking;

const Seat = ({ seat, handleSeatClick }) => (
  <button
    className={`flex items-center justify-center rounded-md w-14 h-14 border-2 ${
      seat.isBooked || seat.seatAvailableState === "Booked"
        ? "bg-red-500 cursor-not-allowed text-white"
        : seat.seatAvailableState === "Processing"
        ? "bg-green-400 cursor-not-allowed"
        : " bg-transparent cursor-pointer text-black border-blue-400"
    }`}
    disabled={seat.seatAvailableState !== "Available"}
    onClick={() => !seat.isBooked && handleSeatClick(seat)}
  >
    <p className="text-[14px] font-poppins font-bold">{seat.seatNumber}</p>
  </button>
);

const SeatDisplay = ({ schedule, handleSeatClick, startWith }) => {
  // Group seats by their prefix (L1, L2, etc.)
  const groupedSeats =
    schedule
      ?.filter((seat) => seat.seatNumber.startsWith(startWith)) // Filter relevant seats
      ?.reduce((acc, seat) => {
        const prefix = seat.seatNumber.split("-")[0]; // Extract prefix (e.g., "L1")
        if (!acc[prefix]) {
          acc[prefix] = [];
        }
        acc[prefix].push(seat);
        return acc;
      }, {}) || {}; // Fallback to an empty object

  // Convert the grouped seats object into an array of arrays (sorted by prefix)
  const seatColumns = Object.entries(groupedSeats)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort by prefix (L1, L2, etc.)
    .map(([_, seats]) => seats);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      {seatColumns.map((column, index) => (
        <div
          key={index}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {column.map((seat) => (
            <Seat
              key={seat.seatNumber}
              seat={seat}
              handleSeatClick={handleSeatClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
