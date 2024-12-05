import React, { useEffect, useState } from "react";
import {
  cancelSeatBooking,
  fetchUserDetails,
  resetPassword,
  updateUserDetails,
} from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/toastNotifications";
import { userLogout } from "../store";
import socket from "../helpers/ConnectWebSocket";

const Profile = () => {
  const [isProfile, setIsProfile] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isBookings, setIsBookings] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;

  const [canselSeatModal, setCanselSeatModal] = useState(false);
  const [cancelSeatDetails, setCancelSeatDetails] = useState({
    userId: "",
    seatNumbers: [],
    reason: "",
    bookingId: "",
    cancelAll: false,
    scheduleId: "",
  });

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatToggle = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const [userDetails, setUserDetails] = useState({});

  const [updateProfile, setUpdateProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    contactNumber: "",
    nic: "",
    address: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const fetchUserProfile = async () => {
    try {
      const response = await fetchUserDetails(userId);
      const { data } = response;
      setUserDetails(data);
      setUpdateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        contactNumber: data.contactNumber,
        nic: data.nic,
        address: data.address,
      });
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

  const cancelSeat = async (cancelSeatDetails) => {
    try {
      const { bookingId, scheduleId, ...otherDetails } = cancelSeatDetails;
      const response = await cancelSeatBooking(bookingId, otherDetails);
      const { message } = response;
      showToast("success", message);
      fetchUserProfile();

      // Flatten seatNumbers before emitting the socket event
      const flattenedSeats = cancelSeatDetails?.seatNumbers.flat();

      if (cancelSeatDetails.cancelAll) {
        socket.emit("cancelSeats", {
          scheduleId: cancelSeatDetails.scheduleId,
          seats: flattenedSeats,
          cancelAll: true,
        });
      } else {
        socket.emit("cancelSeats", {
          scheduleId: cancelSeatDetails.setCancelSeatDetails,
          seats: flattenedSeats,
          cancelAll: false,
        });
      }

      setCancelSeatDetails({
        userId: "",
        seatNumbers: [],
        reason: "",
        bookingId: "",
        cancelAll: false,
        scheduleId: "",
      });
      setSelectedSeats([]);
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
    setCanselSeatModal(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = (e) => {
    setUpdateProfile({
      ...updateProfile,
      [e.target.id]: e.target.value,
    });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserDetails(userId, updateProfile);
      const { message } = response;
      showToast("success", message);
      fetchUserProfile();
      setIsUpdateProfile(false);
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

  const changeIsUpdateProfileState = () => {
    setIsUpdateProfile(!isUpdateProfile);
    if (isUpdateProfile) {
      setUpdateProfile({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        username: userDetails.username,
        email: userDetails.email,
        contactNumber: userDetails.contactNumber,
        nic: userDetails.nic,
        address: userDetails.address,
      });
    }
  };

  useEffect(() => {
    if (canselSeatModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [canselSeatModal]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("error", "All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }
    try {
      const response = await resetPassword(userId, {
        oldPassword,
        newPassword,
      });
      const { message } = response;
      showToast("success", message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  return (
    <div className=" flex gap-10 p-8">
      <div className=" border-[1px] h-[200px] border-gray-400 rounded-lg p-4 w-[300px]">
        <h2 className=" font-poppins font-bold text-2xl">Options</h2>
        <div className=" flex flex-col gap-2 mt-3 font-poppins ml-3 text-lg">
          <div
            onClick={() => {
              setIsProfile(true);
              setIsChangePassword(false);
              setIsBookings(false);
            }}
            className="  flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-[50px] h-[2px] ${
                isProfile ? "bg-red-500" : "bg-black"
              }`}
            ></div>
            <p className={`${isProfile ? "text-red-500" : ""}`}>Profile</p>
          </div>
          <div
            onClick={() => {
              setIsProfile(false);
              setIsChangePassword(true);
              setIsBookings(false);
            }}
            className="  flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-[50px] h-[2px] ${
                isChangePassword ? "bg-red-500" : "bg-black"
              }`}
            ></div>
            <p className={`${isChangePassword ? "text-red-500" : ""}`}>
              Change Password
            </p>
          </div>
          <div
            onClick={() => {
              setIsProfile(false);
              setIsChangePassword(false);
              setIsBookings(true);
            }}
            className="  flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-[50px] h-[2px] ${
                isBookings ? "bg-red-500" : "bg-black"
              }`}
            ></div>
            <p className={`${isBookings ? "text-red-500" : ""}`}>Bookings</p>
          </div>
        </div>
      </div>
      <div className=" flex-1 border-[1px] rounded-lg border-gray-400">
        {isProfile && (
          <div className=" p-4">
            <div className=" flex justify-between items-center">
              <h2 className=" font-poppins font-bold text-2xl">
                {isUpdateProfile ? "Update Profile" : "Profile"}
              </h2>
              <button
                onClick={changeIsUpdateProfileState}
                className=" bg-green-600 text-white px-3 py-2 text-[14px] rounded-lg mt-4"
              >
                {isUpdateProfile ? "Cancel" : "Update Profile"}
              </button>
            </div>
            <form className=" mt-4" onSubmit={updateProfileHandler}>
              <div className=" grid grid-cols-2 gap-6">
                {/* first Name */}
                <div className=" flex flex-col gap-4">
                  <label
                    htmlFor="firstName"
                    className=" font-poppins font-bold"
                  >
                    First Name
                  </label>
                  <input
                    disabled={!isUpdateProfile}
                    type="text"
                    id="firstName"
                    name="firstName"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg"
                    value={updateProfile.firstName}
                    onChange={handleUpdateProfile}
                  />
                </div>
                {/* last Name */}
                <div className=" flex flex-col gap-4 ">
                  <label htmlFor="lastName" className=" font-poppins font-bold">
                    Last Name
                  </label>
                  <input
                    disabled={!isUpdateProfile}
                    type="text"
                    id="lastName"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg"
                    value={updateProfile.lastName}
                    onChange={handleUpdateProfile}
                    name="lastName"
                  />
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-6 mt-4">
                {/* username */}
                <div className=" flex flex-col gap-4">
                  <label htmlFor="username" className=" font-poppins font-bold">
                    Username
                  </label>
                  <input
                    disabled={!isUpdateProfile}
                    type="text"
                    id="username"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg"
                    value={updateProfile.username}
                    onChange={handleUpdateProfile}
                    name="username"
                  />
                </div>
                {/* email */}
                <div className=" flex flex-col gap-4">
                  <label htmlFor="email" className=" font-poppins font-bold">
                    Email
                  </label>
                  <input
                    disabled={true}
                    type="email"
                    id="email"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg cursor-not-allowed"
                    value={updateProfile.email}
                  />
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-6 mt-4">
                {/* phone */}
                <div className=" flex flex-col gap-4 ">
                  <label htmlFor="phone" className=" font-poppins font-bold">
                    Phone
                  </label>
                  <input
                    disabled={!isUpdateProfile}
                    type="text"
                    id="contactNumber"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg"
                    value={updateProfile.contactNumber}
                    onChange={handleUpdateProfile}
                    name="contactNumber"
                  />
                </div>
                {/* Nic */}
                <div className=" flex flex-col gap-4 ">
                  <label htmlFor="nic" className=" font-poppins font-bold">
                    NIC
                  </label>
                  <input
                    disabled={!isUpdateProfile}
                    type="text"
                    id="nic"
                    className=" p-2 border-[1px] border-gray-400 rounded-lg"
                    value={updateProfile.nic}
                    onChange={handleUpdateProfile}
                    name="nic"
                  />
                </div>
              </div>
              {/* address */}
              <div className=" flex flex-col gap-4 mt-4">
                <label htmlFor="address" className=" font-poppins font-bold">
                  Address
                </label>
                <textarea
                  disabled={!isUpdateProfile}
                  id="address"
                  className=" p-2 border-[1px] border-gray-400 rounded-lg"
                  value={updateProfile.address}
                  onChange={handleUpdateProfile}
                  name="address"
                />
              </div>
              {/* update button */}
              {isUpdateProfile && (
                <div className=" mt-4">
                  <button className=" bg-red-500 text-white py-2 px-6 rounded-lg">
                    Update
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {isChangePassword && (
          <div className=" p-4">
            <h2 className=" font-poppins font-bold text-2xl">
              Change Password
            </h2>
            <form className=" mt-4" onSubmit={handleResetPassword}>
              <div className=" flex flex-col gap-4">
                <label
                  htmlFor="currentPassword"
                  className=" font-poppins font-bold"
                >
                  Current Password
                </label>
                <div className=" relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="currentPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className=" p-2 border-[1px] border-gray-400 rounded-lg w-full"
                  />
                  <span
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className=" absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showOldPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>
              <div className=" flex flex-col gap-4 mt-4">
                <label
                  htmlFor="newPassword"
                  className=" font-poppins font-bold"
                >
                  New Password
                </label>
                <div className=" relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className=" p-2 border-[1px] border-gray-400 rounded-lg w-full"
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className=" absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>
              <div className=" flex flex-col gap-4 mt-4">
                <label
                  htmlFor="confirmPassword"
                  className=" font-poppins font-bold"
                >
                  Confirm Password
                </label>
                <div className=" relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className=" p-2 border-[1px] border-gray-400 rounded-lg w-full"
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className=" absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>
              <div className=" mt-4">
                <button className=" bg-red-500 text-white p-2 rounded-lg">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}

        {isBookings && (
          <div className="p-4">
            <h2 className="font-poppins font-bold text-2xl">Bookings</h2>
            <div className="mt-4">
              <div className="flex flex-col gap-4">
                {userDetails?.bookings?.length === 0 ? (
                  <p className="font-poppins text-lg text-center text-green-600 font-bold mt-3">
                    You have no bookings
                  </p>
                ) : (
                  userDetails?.bookings?.map((booking, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 p-4 rounded-lg"
                    >
                      {/* Booking Header */}
                      <div className=" flex items-center justify-between">
                        <h2 className="font-poppins font-bold text-xl">
                          Booking {index + 1}
                        </h2>
                        {booking.bookingSeats.length === 0 && (
                          <p className="text-sm text-red-500 text-[14px] font-bold">
                            Entire booking was canceled.
                          </p>
                        )}
                      </div>
                      <div className=" flex gap-20 items-center mt-2">
                        <div className=" flex flex-col gap-2">
                          <p className="text-gray-600 font-poppins text-sm">
                            Booking ID: {booking._id}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Payment Method: {booking.paymentMethod}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Payment Status: {booking.paymentStatus}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Total Amount Paid: Rs.{booking.amount}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Payment Date:{" "}
                            {new Date(booking.paymentDate).toLocaleString()}
                          </p>
                        </div>
                        <div className=" flex flex-col gap-2">
                          <p className="text-gray-600 font-poppins text-sm">
                            Journey Date:{" "}
                            {new Date(
                              booking.scheduleDetails.date
                            ).toLocaleString()}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Journey Time:{" "}
                            {booking.scheduleDetails.departureTime}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            Bus Number:{" "}
                            {booking.scheduleDetails.busDetails.busId}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            From: {booking.scheduleDetails.fromCity}
                          </p>
                          <p className="text-gray-600 font-poppins text-sm">
                            To: {booking.scheduleDetails.toCity}
                          </p>
                        </div>
                      </div>

                      {/* Booked Seats */}
                      <div className="mt-2">
                        <h3 className="font-poppins font-bold text-lg">
                          Booked Seats
                        </h3>
                        {booking.bookingSeats.length > 0 ? (
                          <div>
                            <ul className="list-disc ml-5">
                              {booking.bookingSeats.map((seat, idx) => (
                                <li
                                  key={idx}
                                  className="font-poppins text-sm mb-2"
                                >
                                  <div className="flex gap-1 items-center">
                                    <input
                                      type="checkbox"
                                      id={`seat-${seat}`}
                                      checked={selectedSeats.includes(seat)}
                                      onChange={() => handleSeatToggle(seat)}
                                      className="mr-1"
                                    />
                                    <label
                                      htmlFor={`seat-${seat}`}
                                      className="text-[14px]"
                                    >
                                      Seat Number: {seat}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => {
                                setCanselSeatModal(true);
                                setCancelSeatDetails({
                                  userId: userDetails._id,
                                  seatNumbers: selectedSeats,
                                  reason: "",
                                  bookingId: booking._id,
                                  cancelAll: false,
                                  scheduleId: booking.scheduleDetails._id,
                                });
                              }}
                              className={`bg-red-500 text-white px-2 text-[12px] py-1 rounded-md mt-2 ${
                                selectedSeats.length === 0
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                              disabled={selectedSeats.length === 0}
                            >
                              Cancel Selected Seats
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No seats booked.
                          </p>
                        )}
                      </div>

                      {/* Canceled Seats */}
                      <div className="mt-2">
                        <h3 className="font-poppins font-bold text-lg">
                          Canceled Seats
                        </h3>
                        {booking.cancelSeats.length > 0 ? (
                          <ul className="list-disc ml-5">
                            {booking.cancelSeats.map((cancel, idx) => (
                              <li
                                key={idx}
                                className="font-poppins text-sm text-red-500"
                              >
                                Seat Number: {cancel.seatNumber} - Canceled By:{" "}
                                {cancel.userId === userDetails._id
                                  ? "You"
                                  : "Operator"}{" "}
                                - Reason: {cancel.reason} - Canceled At:{" "}
                                {new Date(cancel.cancelDate).toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No seats canceled.
                          </p>
                        )}
                      </div>

                      {/* Cancel Entire Booking */}
                      {booking.bookingSeats.length > 0 && (
                        <div className="mt-2 w-full flex justify-end">
                          <button
                            onClick={() => {
                              setCanselSeatModal(true);
                              setCancelSeatDetails({
                                userId: userDetails._id,
                                seatNumbers: [booking.bookingSeats],
                                reason: "",
                                bookingId: booking._id,
                                cancelAll: true,
                                scheduleId: booking.scheduleDetails._id,
                              });
                            }}
                            className="bg-red-500 text-white px-2 py-2 rounded-md text-sm"
                          >
                            Cancel Entire Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Seat Modal */}
      {canselSeatModal && (
        <div className=" fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex z-50 justify-center items-center">
          <div className=" bg-white p-4 w-[500px] rounded-lg z-40">
            <h2 className=" font-poppins font-bold text-2xl">
              Cancel Seat Confirmation
            </h2>
            <p className="font-poppins text-lg mt-4">
              Are you sure you want to cancel this{" "}
              {cancelSeatDetails.seatNumbers
                .map((seat) => `${seat} `)
                .join(", ")}{" "}
              seat?
            </p>
            <textarea
              type="text"
              placeholder="Reason for canceling"
              className=" p-2 border-[1px] border-gray-400 rounded-lg mt-4 w-full"
              value={cancelSeatDetails.reason}
              onChange={(e) =>
                setCancelSeatDetails({
                  ...cancelSeatDetails,
                  reason: e.target.value,
                })
              }
            />
            <div className=" mt-4">
              <button
                onClick={() => setCanselSeatModal(false)}
                className=" bg-red-500 text-white py-2 rounded-lg px-6"
              >
                No
              </button>
              <button
                disabled={!cancelSeatDetails.reason}
                onClick={() => cancelSeat(cancelSeatDetails)}
                className={` bg-green-600 text-white px-6 py-2 rounded-lg ml-2 ${
                  !cancelSeatDetails.reason ? "cursor-not-allowed" : ""
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
