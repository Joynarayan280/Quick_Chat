import React, { useState, useContext } from "react"; // 👈 পরিবর্তন ১: useContext ইমপোর্ট করা হয়েছে
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setISDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext) // 👈 পরিবর্তন ২: {} এর ভেতরে login বসানো হয়েছে

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Stage 1 (Signup page — email, password, name)
    if (currState === 'Sign up' && !isDataSubmitted) {
      setISDataSubmitted(true);
      return;
    }

    login(currState=== 'Sign up' ? 'signup' : 'login', {fullName, email, password, bio} )

    // Stage 2 (Final submit)
    console.log({
      fullName,
      email,
      password,
      bio,
      currState,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col px-4 backdrop-blur-2xl">

      {/* Left Logo */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

      {/* Right Card Form */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-full max-w-[320px]"
      >
        {/* Header */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer"
              onClick={() => setISDataSubmitted(false)}
            />
          )}
        </h2>

        {/* Full Name (Sign up Step 1 only) */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        {/* Email + Password (Login OR Sign up Step 1) */}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* Bio (Sign up Step 2 only) */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Provide a short bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="py-3 rounded-md bg-gradient-to-r from-purple-400 to-violet-500 text-white font-medium"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms */}
        <div className="flex items-start gap-2 text-sm">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/* Bottom Text */}
        <div className="text-sm text-gray-200">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                className="font-medium text-violet-400 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setISDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span
                className="font-medium text-violet-400 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                  setISDataSubmitted(false);
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;