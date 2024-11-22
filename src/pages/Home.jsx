import React, { useEffect, useState } from "react";
import BgImage from "../assets/colombo-sri-lanka.jpg";
import DropDown from "../components/Form/DropDown";
import { useInput } from "../hooks/use-input";
import { isNotEmpty } from "../validation/validations";
import { fetchAllCities } from "../services/apiService";
import showToast from "../utils/toastNotifications";
import SearchableDropDown from "../components/Form/SearchableDropDown";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Set the default date to today in "YYYY-MM-DD" format
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetchAllCities();
        setCities(response.data);
      } catch (error) {
        const { error: response } = error;
        if (response?.message === "Token expired" && response?.statusCode === 401) {
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

    fetchCities();
  }, []);

  const {
    value: from,
    id: fromId,
    handleInputChange: handleFromChange,
    handleInputBlur: handleFromBlur,
    hasError: fromHasError,
    setValue: setFrom,
    reset: resetFrom,
  } = useInput("", isNotEmpty);

  const {
    value: to,
    id: toId,
    handleInputChange: handleToChange,
    handleInputBlur: handleToBlur,
    hasError: toHasError,
    setValue: setTo,
    reset: resetTo,
  } = useInput("", isNotEmpty);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (fromHasError || toHasError) {
      return;
    }

    navigate(`/search?from=${from}&to=${to}&date=${selectedDate}`);
  }

  return (
    <div className=" font-sans">
      <div className="relative h-[220px]">
        <img src={BgImage} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl text-white font-bold mb-4 uppercase">
            Welcome to SLTB
          </h1>
          <p className=" text-white p-3">
            SLTB is a online bus seat reservation system. You can reserve your
            bus seat online. You can select your bus and select your seat and
            reserve it. You can pay your reservation fee online.
          </p>
        </div>
      </div>
      <div className="max-w-7xl bg-blue-200 h-40  rounded-lg mx-auto ">
        <h1 className=" text-lg font-bold py-3 px-3 text-white bg-blue-800 rounded-tl-lg rounded-tr-lg">
          Online Seat Reseravation
        </h1>
        <form onSubmit={handleSearch} className=" flex flex-col items-center">
        <div className=" grid grid-cols-3 gap-5 px-4 py-3">
          <SearchableDropDown
            id="from"
            name="from"
            type="text"
            placeholder="Ex: Colombo"
            containerStyle={`w-full lg:w-[350px] h-[40px]`}
            dropdownDivStyle={`w-full lg:w-[350px] h-[40px]`}
            dropdownStyle={`w-full lg:w-[350px] h-[40px]`}
            label={
              <>
                From <span className="text-red-600">*</span>
              </>
            }
            options={cities}
            defaultOption="Select city"
            idKey="_id"
            valueKey="name"
            value={from}
            onChange={handleFromChange}
            onBlur={handleFromBlur}
            error={fromHasError && "Please select city"}
          />
          <SearchableDropDown
            id="to"
            name="to"
            type="text"
            placeholder="Ex: Kandy"
            containerStyle={`w-full lg:w-[350px] h-[40px]`}
            dropdownDivStyle={`w-full lg:w-[350px] h-[40px]`}
            dropdownStyle={`w-full lg:w-[350px] h-[40px]`}
            label={
              <>
                To <span className="text-red-600">*</span>
              </>
            }
            options={cities}
            defaultOption="Select city"
            idKey="_id"
            valueKey="name"
            value={to}
            onChange={handleToChange}
            onBlur={handleToBlur}
            error={toHasError && "Please select city"}
          />
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-700 font-bold">
              Select Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div className="text-center mt-5 w-[250px] h-[50px]">
          <button
            type="submit"
            className="bg-blue-800 text-white w-full h-full rounded-md mt-2"
          >
            Search Buses
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
