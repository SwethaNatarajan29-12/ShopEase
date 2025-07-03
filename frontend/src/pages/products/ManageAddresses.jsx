import React, { useEffect, useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaMapMarkerAlt, FaPlus, FaTrash, FaHome, FaBriefcase } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "../../slices/addressSlice";

const initialAddress = {
  fullName: "",
  phone: "",
  altPhone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  type: "home"
};

const ManageAddresses = () => {
  const dispatch = useDispatch();
  const addressesRaw = useSelector((state) => state.address.items);
  const addresses = Array.isArray(addressesRaw) ? addressesRaw : [];
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [editAddressId, setEditAddressId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddressSave = async (e) => {
    e.preventDefault();
    if (
      !addressInput.fullName.trim() ||
      !addressInput.phone.trim() ||
      addressInput.phone.length !== 10 ||
      (addressInput.altPhone && addressInput.altPhone.length !== 10) ||
      !addressInput.address1.trim() ||
      !addressInput.city.trim() ||
      !addressInput.state.trim() ||
      !addressInput.pincode.trim()
    ) return;
    if (editAddressId !== null) {
      await dispatch(updateAddress({ id: editAddressId, ...addressInput }));
      await dispatch(fetchAddresses());
    } else {
      await dispatch(addAddress(addressInput));
      await dispatch(fetchAddresses());
    }
    setShowAddressForm(false);
    setAddressInput(initialAddress);
    setEditAddressId(null);
  };
  const handleEditAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    setAddressInput(addr);
    setEditAddressId(id);
    setShowAddressForm(true);
  };
  const handleAddAddress = () => {
    setAddressInput(initialAddress);
    setEditAddressId(null);
    setShowAddressForm(true);
  };
  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id));
    if (editAddressId === id) {
      setShowAddressForm(false);
      setEditAddressId(null);
      setAddressInput(initialAddress);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 p-8">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-pink-100">
        <div className="flex items-center gap-2 mb-8">
          <FaMapMarkerAlt className="text-pink-400 text-2xl" />
          <h2 className="text-2xl font-bold text-pink-600 tracking-tight">Manage Addresses</h2>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-200 mb-6"
          onClick={handleAddAddress}
          title="Add Address"
        >
          <FaPlus /> Add New Address
        </button>
        {showAddressForm && (
          <form onSubmit={handleAddressSave} className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={addressInput.fullName}
                onChange={e => setAddressInput({ ...addressInput, fullName: e.target.value })}
                className="input input-bordered rounded-xl px-4 py-2 w-1/2"
                placeholder="Full Name*"
                required
              />
              <input
                type="text"
                value={addressInput.phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setAddressInput({ ...addressInput, phone: val });
                }}
                className="input input-bordered rounded-xl px-4 py-2 w-1/2"
                placeholder="Phone Number*"
                required
                maxLength={10}
                inputMode="numeric"
                title="Enter a 10 digit phone number"
              />
            </div>
            <input
              type="text"
              value={addressInput.altPhone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setAddressInput({ ...addressInput, altPhone: val });
              }}
              className="input input-bordered rounded-xl px-4 py-2"
              placeholder="Alternative Phone Number (optional)"
              maxLength={10}
              inputMode="numeric"
              title="Enter a 10 digit phone number"
            />
            <input
              type="text"
              value={addressInput.address1}
              onChange={e => setAddressInput({ ...addressInput, address1: e.target.value.slice(0, 100) })}
              className="input input-bordered rounded-xl px-4 py-2"
              placeholder="Address Line 1*"
              required
              maxLength={100}
            />
            <input
              type="text"
              value={addressInput.address2}
              onChange={e => setAddressInput({ ...addressInput, address2: e.target.value.slice(0, 100) })}
              className="input input-bordered rounded-xl px-4 py-2"
              placeholder="Address Line 2 (optional)"
              maxLength={100}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={addressInput.city}
                onChange={e => setAddressInput({ ...addressInput, city: e.target.value })}
                className="input input-bordered rounded-xl px-4 py-2 w-1/3"
                placeholder="City*"
                required
              />
              <input
                type="text"
                value={addressInput.state}
                onChange={e => setAddressInput({ ...addressInput, state: e.target.value })}
                className="input input-bordered rounded-xl px-4 py-2 w-1/3"
                placeholder="State*"
                required
              />
              <input
                type="text"
                value={addressInput.pincode}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setAddressInput({ ...addressInput, pincode: val });
                }}
                className="input input-bordered rounded-xl px-4 py-2 w-1/3"
                placeholder="Pincode*"
                required
                maxLength={6}
                inputMode="numeric"
                title="Enter a 6 digit pincode"
              />
            </div>
            <div className="flex gap-4 items-center mt-2">
              <span className="font-semibold text-gray-700">Type:</span>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${addressInput.type === 'home' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-500'} font-semibold transition`}
                onClick={() => setAddressInput({ ...addressInput, type: 'home' })}
              >
                <FaHome /> Home
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${addressInput.type === 'work' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-gray-100 border-gray-300 text-gray-500'} font-semibold transition`}
                onClick={() => setAddressInput({ ...addressInput, type: 'work' })}
              >
                <FaBriefcase /> Work
              </button>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button type="submit" className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition" title="Save"><FaCheck /></button>
              <button type="button" className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition" onClick={() => { setShowAddressForm(false); setEditAddressId(null); setAddressInput(initialAddress); }} title="Cancel"><FaTimes /></button>
            </div>
          </form>
        )}
        <div className="flex flex-col gap-4">
          {addresses.length === 0 && !showAddressForm && (
            <div className="italic text-gray-400 text-center">No addresses saved yet.</div>
          )}
          {addresses.map(addr => (
            <div key={addr.id} className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 shadow group">
              <div className="flex-1">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  {addr.type === 'home' ? <FaHome className="text-blue-400" /> : <FaBriefcase className="text-pink-400" />}
                  {addr.fullName} <span className="text-xs font-normal text-gray-400">({addr.type.charAt(0).toUpperCase() + addr.type.slice(1)})</span>
                </div>
                <div className="text-gray-700 text-sm mt-1">{addr.address1}{addr.address2 && ", " + addr.address2}, {addr.city}, {addr.state} - {addr.pincode}</div>
                <div className="text-gray-500 text-xs mt-1">Phone: {addr.phone}{addr.altPhone && `, Alt: ${addr.altPhone}`}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow hover:scale-110 transition-transform duration-200"
                  onClick={() => handleEditAddress(addr.id)}
                  title="Edit Address"
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white shadow hover:scale-110 transition-transform duration-200"
                  onClick={() => handleDeleteAddress(addr.id)}
                  title="Delete Address"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAddresses;
