import React, { useEffect, useState } from "react";
import { GiHummingbird } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { isEmail, isNotEmpty } from "../../validation/validations";
import { useInput } from "../../hooks/use-input";
import { GoSync } from "react-icons/go";
import showToast from "../../utils/toastNotifications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThunk } from "../../hooks/use-thunk";
import { signUp } from "../../store";

const Register = () => {
  const navigate = useNavigate();

  const [doSignUp, isSignUpLoadUpg, signUpError, signUpSuccessMsg] =
    useThunk(signUp);

  const {
    value: username,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
    setValue: setUsername,
    reset: resetUsername,
  } = useInput("", isNotEmpty);

  const {
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    setValue: setEmail,
    reset: resetEmail,
  } = useInput("", isEmail);

  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    setValue: setPassword,
    reset: resetPassword,
  } = useInput("", isNotEmpty);

  const {
    value: confirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
    setValue: setConfirmPassword,
    reset: resetConfirmPassword,
  } = useInput("", (value) => value === password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailHasError || passwordHasError) {
      return;
    }

    doSignUp({ username, email, password }, "Sign up successful");
  };

  useEffect(() => {
    if (signUpError?.error?.message) {
      showToast("error", signUpError.error.message);
    }

    if (signUpSuccessMsg) {
      showToast("success", signUpSuccessMsg);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [signUpSuccessMsg, signUpError, navigate]);

  return (
    <div className=" h-screen w-screen flex items-center justify-center">
      <div className=" w-[900px] grid grid-cols-2 p-4">
        <div className=" flex flex-col items-center justify-center">
          <div className=" flex items-center gap-2">
            <h1 className=" max-[400px]:text-xl text-6xl font-bold text-gray-700 font-mono">
              SLTB
            </h1>
            <GiHummingbird className="max-[400px]:text-lg  text-6xl text-red-600" />
          </div>
        </div>

        <div className="">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight to-blue-500">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                for="username"
                className="block text-sm font-medium leading-6 text-balance"
              >
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  value={username}
                  className="block w-full px-2 rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-balck sm:text-sm sm:leading-6"
                />
                {usernameHasError && (
                  <p className="text-red-500 text-sm mt-1 font-sans font-normal">
                    Username is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                for="email"
                className="block text-sm font-medium leading-6 text-balance"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  value={email}
                  className="block w-full px-2 rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-balck sm:text-sm sm:leading-6"
                />
                {emailHasError && (
                  <p className="text-red-500 text-sm mt-1 font-sans font-normal">
                    Enter a valid email address
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  value={password}
                  className="block w-full px-2 rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
                {passwordHasError && (
                  <p className="text-red-500 text-sm mt-1 font-sans font-normal">
                    Password is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                    Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="confirm-password"
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  value={confirmPassword}
                  className="block w-full px-2 rounded-md border-0 bg-white/5 py-1.5 text-cyan-600 shadow-sm ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
                {confirmPasswordHasError && (
                  <p className="text-red-500 text-sm mt-1 font-sans font-normal">
                    Password does not match
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                disabled={
                  isSignUpLoadUpg ||
                  emailHasError ||
                  passwordHasError ||
                  confirmPasswordHasError ||
                  !username ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              >
                {isSignUpLoadUpg ? (
                  <GoSync className="animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-red-500 hover:text-red-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Register;
