import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  const userError = useSelector((state) => state.user.error);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [passwordError, setPasswordError] = useState(""); // for real-time feedback

  useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setSubmitted(false);
    // Real-time max length feedback
    if (val.length > 12) {
      setPasswordError("Password cannot exceed 12 characters.");
    } else {
      setPasswordError("");
    }
    setLocalError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLocalError("");
    setPasswordError("");
    if (password.length > 12) {
      setLocalError("Password cannot exceed 12 characters.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    try {
      await dispatch(registerUser({ username: name, email, password })).unwrap();
      // navigate removed: redirect handled by useEffect
    } catch (err) {
      setFormKey(prev => prev + 1); // Force re-render
    }
  };

  // Debug log to confirm error values in render
  if (submitted) console.log('SignUp localError:', localError, 'Redux userError:', userError);

  // Reset submitted state and local error on input change, but do NOT reset Redux error
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setSubmitted(false);
    setLocalError("");
    if (setter === setPassword) setPasswordError("");
  };

  // Clear localError if userError is present
  if (userError && localError) setLocalError("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <div className="flex-1" />
      <div
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-600 drop-shadow-lg">
          Sign Up
        </h2>
        <form className="w-full" onSubmit={handleRegister} key={formKey}>
          <div className="relative w-full mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400">
              <FaUser />
            </span>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full rounded-full px-12 py-3 focus:ring-2 focus:ring-yellow-400 transition-all"
              value={name}
              onChange={handleInputChange(setName)}
              required
            />
          </div>
          <div className="relative w-full mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full rounded-full px-12 py-3 focus:ring-2 focus:ring-pink-400 transition-all"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
            />
          </div>
          <div className="relative w-full mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
              <FaLock />
            </span>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full rounded-full px-12 py-3 focus:ring-2 focus:ring-blue-400 transition-all"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={8}
              maxLength={12}
            />
          </div>
          {passwordError && (
            <div className="text-red-500 text-center mb-2">{passwordError}</div>
          )}
          {(userError || localError) && !passwordError && (
            <div className="text-red-500 text-center mb-2">{localError ? localError : userError !== "Unauthorized to access" ? userError : ""}</div>
          )}
          <button
            className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-500 text-white font-bold text-lg shadow-lg transition-transform duration-200"
            type="submit"
            disabled={userStatus === 'loading'}
          >
            {userStatus === 'loading' ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      <div className="flex-1" />
    </div>
  );
};

export default SignUp;