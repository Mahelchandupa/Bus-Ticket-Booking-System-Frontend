import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import showToast from "../utils/toastNotifications";
import { fetchScheduleById } from "../services/apiService";
import busImg from "../assets/bus-img.jpg";
import ArrowImg from "../assets/arrow.png";

const Booking = () => {
  const { scheduleId } = useParams();

  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetchScheduleById(scheduleId);
        console.log("response", response);
        setSchedule(response.data);
      } catch (error) {
        const { error: response } = error;
        if (
          response?.message === "Token expired" &&
          response?.statusCode === 401
        ) {
          showToast("error", "Token expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
          return;
        } else {
          showToast("error", response?.message);
        }
      }
    };

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

  console.log(schedule.seatStatus);

  const handleSeatClick = (seat) => {
    console.log(`Seat ${seat.seatNumber} clicked!`);
    // Add your booking logic here
  };

  return (
    <div className=" mt-[100px] mb-[100px]">
      <div className=" max-w-5xl mx-auto">
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
          <h1 className="text-2xl font-bold text-center mt-10">
            Select a Seat
          </h1>
          <div className=" flex gap-10 mt-5">
            <div className=" flex flex-col gap-10">
              {/* Right Side Seats */}
              <SeatDisplay
                schedule={schedule}
                handleSeatClick={handleSeatClick}
                startWith="R"
              />
              {/* Left Side Seats */}
              <SeatDisplay
                schedule={schedule}
                handleSeatClick={handleSeatClick}
                startWith="L"
              />
            </div>
            <div className=" ">
              <SeatDisplay
                schedule={schedule}
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
                    <p className="text-[14px] font-bold">{route?.distanceKm} KM</p>
                  </div>
                  <div className=" flex flex-col">
                    <p className=" text-[12px] font-poppins text-slate-600 font-bold">
                      Duration
                    </p>
                    <p className="text-[14px] font-bold">{route.estimatedTime}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        {/* <div  className=" w-[400px] border rounded-lg">
            skdf
        </div> */}
      </div>
    </div>
  );
};

export default Booking;

const Seat = ({ seat, handleSeatClick }) => (
  <div
    className={`flex items-center justify-center rounded-md w-14 h-14 border-2 ${
      seat.isBooked
        ? "bg-red-500 cursor-not-allowed text-white"
        : " bg-transparent cursor-pointer text-black border-blue-400"
    }`}
    onClick={() => !seat.isBooked && handleSeatClick(seat)}
  >
    <p className="text-[14px] font-poppins font-bold">{seat.seatNumber}</p>
  </div>
);

const SeatDisplay = ({ schedule, handleSeatClick, startWith }) => {
  // Group seats by their prefix (L1, L2, etc.)
  const groupedSeats =
    schedule?.seatStatus
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
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      {seatColumns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {column
            .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber)) // Ensure seats are sorted within each column
            .map((seat) => (
              <Seat
                key={seat._id}
                seat={seat}
                handleSeatClick={handleSeatClick}
              />
            ))}
        </div>
      ))}
    </div>
  );
};
