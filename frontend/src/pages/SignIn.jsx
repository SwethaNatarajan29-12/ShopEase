import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/userSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  const userError = useSelector((state) => state.user.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // navigate removed: redirect handled by useEffect
    } catch (err) {
      let backendMsg = typeof err === "string" ? err : "";
      // console.log('Login error:', err, 'backendMsg:', backendMsg); // Debug log
      if (backendMsg) {
        setError(backendMsg);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };
  // Debug log to confirm error state is being rendered
  if (error) console.log('Rendering error in UI:', error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
      <div className="flex-1" />
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-500 drop-shadow-lg">
          Sign In
        </h2>
        <form className="w-full" onSubmit={handleLogin}>
          <div className="relative w-full mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full rounded-full px-12 py-3 focus:ring-2 focus:ring-blue-400 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative w-full mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
              <FaLock />
            </span>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full rounded-full px-12 py-3 focus:ring-2 focus:ring-pink-400 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={12}
            />
          </div>
          {submitted && (error || (userStatus === 'failed' && userError)) && (
            <div className="text-red-500 text-center mb-2">{error || userError}</div>
          )}
          <button
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold text-lg shadow-lg transition-transform duration-200"
            type="submit"
            disabled={userStatus === 'loading'}
          >
            {userStatus === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <div className="flex-1" />
    </div>
  );
};

export default SignIn;
