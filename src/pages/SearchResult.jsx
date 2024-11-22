import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSchedulesByParams } from "../services/apiService";
import showToast from "../utils/toastNotifications";
import busImg from "../assets/bus-img.jpg";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const date = queryParams.get("date");

  const [schedules, setSchedules] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResult = async () => {
      try {
        const response = await fetchSchedulesByParams({ from, to, date });
        setSchedules(response.data);
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

    fetchSearchResult();
  }, [from, to, date]);

  return (
    <div className="mt-[80px] font-sans">
      <div className=" max-w-4xl mx-auto ">
        {schedules.length > 0 ? (
          <div>
            {schedules.map((schedule) => (
              <div className=" w-full min-h-[200px] rounded-md overflow-hidden shadow-md">
                <div className=" font-poppins flex items-center justify-between bg-blue-500 px-4 py-2">
                  <h1 className="text-lg font-bold text-white">
                    {schedule?.fromCity} to {schedule?.toCity}
                  </h1>
                  <h2 className="text-lg font-bold text-white">
                    {schedule?.formattedDate}
                  </h2>
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
                        <div className=" flex flex-col">
                          <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                            Available Seats
                          </p>
                          <p className="text-lg font-extrabold">
                            {schedule?.availableSeats}
                          </p>
                        </div>
                      </div>
                      <div className=" flex flex-col gap-3">
                        <div className=" flex flex-col">
                          <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                            Bus Type
                          </p>
                          <p className="text-lg font-extrabold">
                            {schedule.busId.busType}
                          </p>
                        </div>
                        <div className=" flex flex-col">
                          <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                            Bus No
                          </p>
                          <p className="text-lg font-extrabold">
                            {schedule.busId.busId}
                          </p>
                        </div>
                        <div className=" flex flex-col">
                          <p className=" text-[14px] text-slate-600 font-poppins font-bold">
                            Bus Name
                          </p>
                          <p className="text-lg font-extrabold">
                            {schedule.busId.busName}
                          </p>
                        </div>
                      </div>
                      <div className=" self-center text-right">
                        <button
                          onClick={() =>
                            navigate(`/schedule/${schedules.cheduleId}`)
                          }
                          className="bg-yellow-500 font-bold text-white px-4 py-2 rounded-md"
                        >
                          Book Seat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-2xl font-bold text-blue-800">
            No schedules found for the selected route
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
