import React, { useState } from "react";
import { GiHummingbird } from "react-icons/gi";
import { FaUserCog } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import UserProfileAvatar from "../../assets/user-profile-avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../store";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dropDown, setDropDown] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/login");
  }


  return (
    <div className=" w-full fixed top-0 h-[70px] z-50 flex items-center justify-between px-6 shadow-md bg-white rounded-bl-lg rounded-br-lg font-sans ">
      <div onClick={() => navigate('/')} className=" cursor-pointer flex items-center gap-2">
        <h1 className=" max-[400px]:text-xl text-4xl font-bold text-gray-700 font-mono">
          SLTB
        </h1>
        <GiHummingbird className="max-[400px]:text-lg  text-4xl text-red-600" />
      </div>
      <div className="">
        <div
          onClick={() => setDropDown(!dropDown)}
          className="flex items-center gap-2 relative cursor-pointer"
        >
          <h1 className=" text-gray-700 max-[300px]:hidden">Welcome, {currentUser?.username}</h1>
          <img
            src={currentUser?.avatar || UserProfileAvatar}
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          {dropDown && (
            <div className="absolute top-14 border-t-[4px] border-red-500 right-1 w-40 bg-white shadow-md rounded-lg">
              <ul className="p-2 pb-3">
                <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-100 border-b-gray-200 border-b-[1px] p-2 hover:rounded-md cursor-pointer">
                  <FaUserCog className=" text-red-500 text-lg" />
                  Profile
                </Link>
                <li className="flex items-center gap-4 hover:bg-gray-100 p-2 border-b-gray-200 border-b-[1px] hover:rounded-md cursor-pointer">
                  <IoMdSettings className=" text-red-500 text-lg" />
                  Settings
                </li>
                <li onClick={handleLogout} className="flex items-center gap-4 hover:bg-gray-100 p-2 border-b-gray-200 border-b-[1px] hover:rounded-md cursor-pointer">
                  <IoLogOut className=" text-red-500 text-lg" />
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
