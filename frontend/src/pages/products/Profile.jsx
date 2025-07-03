import React, { useEffect, useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaPhoneAlt, FaUserCircle, FaCamera, FaUser, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../slices/userSlice";

const Profile = () => {
  console.log('Profile component rendered');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log('Current user state:', user);
  const [editMode, setEditMode] = useState(false);
  const [mobileInput, setMobileInput] = useState(user?.mobile || "");
  const [editImage, setEditImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [image, setImage] = useState(user?.image || null);

  // Only fetch profile if user is not present
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!editMode) {
      setMobileInput(user?.mobile || "");
      setImage(user?.image || null);
    }
  }, [user, editMode]);

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setEditImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    console.log('handleSave called');
    e.preventDefault();
    try {
      console.log('Attempting profile update...');
      await dispatch(updateProfile({ mobile: mobileInput, image })).unwrap();
      console.log('Profile updated, showing confirmation dialog');
      setShowConfirmation(true);
      // Prevent any state update that would cause a rerender until after dialog
      setTimeout(() => {
        setShowConfirmation(false);
        setEditMode(false);
      }, 2000);
    } catch (error) {
      console.log('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Prevent rerender of form while confirmation dialog is showing
  useEffect(() => {
    if (showConfirmation) {
      // Freeze editMode and form state while dialog is visible
      return;
    }
    if (!editMode) {
      setMobileInput(user?.mobile || "");
      setImage(user?.image || null);
    }
  }, [user, editMode, showConfirmation]);

  // Always render confirmation dialog, even if user is null
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center border-2 border-blue-200 animate-pop">
          <div className="bg-green-100 rounded-full p-4 mb-3 shadow">
            <FaCheck className="text-green-500 text-3xl" />
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-1">Profile info updated</div>
          <div className="text-gray-500 text-sm mb-2">Your changes have been saved successfully.</div>
          <button
            className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => { setShowConfirmation(false); setEditMode(false); }}
            aria-label="Close confirmation"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <div className="text-center mt-16 text-xl text-gray-400">Loading profile...</div>;

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 p-4 pt-8 pb-8">
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className={`bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border border-blue-100 flex flex-col items-center transition-all duration-300 ${showConfirmation ? 'blur-sm pointer-events-none select-none' : ''} min-h-[520px] mt-0`}> 
          {/* Profile Image */}
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow-lg">
              {image ? (
                <img src={image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <FaUserCircle className="text-blue-300 text-8xl" />
              )}
            </div>
            <button
              className="absolute bottom-2 right-2 p-2 rounded-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white shadow hover:scale-110 transition-transform duration-200"
              onClick={() => setEditImage(true)}
              title="Edit Profile Image"
            >
              <FaCamera />
            </button>
            {editImage && (
              <input
                type="file"
                accept="image/*"
                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
                onBlur={() => setEditImage(false)}
                autoFocus
              />
            )}
          </div>
          {/* Info Card or Edit Form */}
          {!editMode ? (
            <div className="flex flex-col gap-2 w-full max-w-sm items-center">
              {/* Username - bold and highlighted */}
              <div className="w-full text-center text-2xl font-extrabold text-blue-700 mb-1 break-all">
                {user.username}
              </div>
              {/* Email - under username */}
              <div className="w-full text-center text-base text-gray-600 font-medium mb-1 break-all">
                {user.email}
              </div>
              {/* Only show mobile if filled */}
              {user.mobile && (
                <div className="w-full text-center text-base text-gray-700 font-semibold">{user.mobile}</div>
              )}
              {/* Edit Profile Button */}
              <button
                className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition text-lg flex items-center gap-2"
                onClick={() => { setEditMode(true); setMobileInput(user.mobile || ""); }}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-6 w-full max-w-sm">
              {/* Username (read-only) */}
              <div className="flex flex-col gap-1 w-full">
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-1">
                  <FaUser className="text-blue-400" /> Username
                </label>
                <span className="text-gray-900 bg-gray-100 px-4 py-2 w-full rounded-xl font-mono shadow-inner border border-gray-200 text-left">
                  {user.username}
                </span>
              </div>
              {/* Email (read-only) */}
              <div className="flex flex-col gap-1 w-full">
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-1">
                  <FaEnvelope className="text-pink-400" /> Email
                </label>
                <span className="text-gray-900 bg-gray-100 px-4 py-2 w-full rounded-xl font-mono shadow-inner border border-gray-200 text-left">
                  {user.email}
                </span>
              </div>
              {/* Mobile (editable) */}
              <div className="flex flex-col gap-1 w-full">
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-1" htmlFor="profile-mobile">
                  <FaPhoneAlt className="text-blue-400" /> Mobile
                </label>
                <div className="flex items-center gap-2 w-full">
                  <input
                    id="profile-mobile"
                    type="text"
                    value={mobileInput}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setMobileInput(val);
                    }}
                    className="input input-bordered rounded-xl px-4 py-2 w-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none shadow text-left"
                    placeholder="Enter mobile number"
                    autoFocus
                    maxLength={10}
                    inputMode="numeric"
                    title="Enter a 10 digit mobile number"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-center mt-2">
                <button type="submit" className="px-6 py-2 rounded-xl bg-green-500 text-white font-bold shadow hover:bg-green-600 transition flex items-center gap-2"><FaCheck /> Save</button>
                <button type="button" className="px-6 py-2 rounded-xl bg-gray-300 text-gray-700 font-bold shadow hover:bg-gray-400 transition flex items-center gap-2" onClick={() => setEditMode(false)}><FaTimes /> Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Animations for overlay */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.25s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  );
};

export default Profile;
