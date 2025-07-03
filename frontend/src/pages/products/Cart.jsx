import React, { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } from "../../slices/cartSlice.js";
import { createPaymentIntent, clearPaymentIntent } from "../../slices/paymentSlice.js";
import { placeOrder } from "../../slices/orderSlice.js";
import { fetchAddresses, addAddress } from "../../slices/addressSlice.js";
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../stripePromise.js';
import { StripeElementsProvider, StripeElementsContext } from '../../StripeElementsContext.jsx';
import { CardElement } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm.jsx';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartRaw = useSelector((state) => state.cart.items);
  const cart = Array.isArray(cartRaw) ? cartRaw : [];
  const paymentIntent = useSelector((state) => state.payment.paymentIntent);
  const user = useSelector((state) => state.user.user); // FIX: use correct user slice
  const addresses = useSelector((state) => state.address.items);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paid, setPaid] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [addressError, setAddressError] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  // Stripe Card Element and payment logic (MOVED UP)
  const [cardError, setCardError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart());
      dispatch(fetchAddresses());
    }
    dispatch(clearPaymentIntent()); // Clear payment intent on mount
  }, [dispatch, user?._id]);

  // Use direct fields from cart item (name, price, etc.) if present, else fallback to item.product
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + ((item.price ?? item.product?.price ?? 0) * (item.quantity || 1)), 0), [cart]);
  const discount = useMemo(() => (subtotal > 200 ? subtotal * 0.1 : 0), [subtotal]);
  const tax = useMemo(() => (subtotal - discount) * 0.08, [subtotal, discount]);
  const total = useMemo(() => subtotal - discount + tax, [subtotal, discount, tax]);

  // Cart actions
  const handleQtyChange = (id, delta) => {
    // Find by either _id or string
    const item = cart.find((i) => (i.product?._id || i.product) === id);
    if (!item) return;
    let newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return; // Do not allow less than 1, use delete for removal
    dispatch(updateCartItem({ id, quantity: newQty }));
  };
  const handleDelete = (id) => {
    dispatch(deleteCartItem(id));
  };

  const handlePayment = async (e, isStripePayment = false) => {
    e.preventDefault();
    if (!user?._id || !selectedAddressId) return;
    const selectedAddress = addresses.find(a => a._id === selectedAddressId || a.id === selectedAddressId);
    if (!selectedAddress) return;
    // Place order in backend
    await dispatch(
      placeOrder({
        userId: user._id,
        paymentMethod,
        address: `${selectedAddress.fullName}, ${selectedAddress.address1}${selectedAddress.address2 ? ', ' + selectedAddress.address2 : ''}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
      })
    );
    dispatch(clearCart());
    dispatch(clearPaymentIntent());
    navigate("/order-success");
  };

  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError('');
    setAddressLoading(true);
    // Simple validation
    if (!addressForm.fullName || !addressForm.address1 || !addressForm.city || !addressForm.state || !addressForm.pincode || !addressForm.phone) {
      setAddressError('Please fill all required fields.');
      setAddressLoading(false);
      return;
    }
    try {
      const res = await dispatch({ type: 'address/addAddress', payload: addressForm });
      if (res && res.payload && (res.payload._id || res.payload.id)) {
        await dispatch(fetchAddresses());
        setSelectedAddressId(res.payload._id || res.payload.id);
        setShowAddressForm(false);
        setAddressForm({ fullName: '', address1: '', address2: '', city: '', state: '', pincode: '', phone: '' });
      } else {
        setAddressError('Failed to add address.');
      }
    } catch (err) {
      setAddressError('Failed to add address.');
    }
    setAddressLoading(false);
  };

  if (!cart || cart.length === 0) {
    return <div className="max-w-5xl mx-auto mt-16 text-center text-2xl text-gray-400 font-bold">Your cart is empty.</div>;
  }
  if (!cart[0].quantity || (!cart[0].name && !cart[0].product)) {
    return <div className="max-w-5xl mx-auto mt-16 text-center text-xl text-red-500 font-bold">Cart data missing product info. Please check your add-to-cart logic.</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeElementsProvider>
        <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row gap-8">
          {/* Centered Cart Products Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 mx-auto md:mx-0 md:w-2/3">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">🛒 Your Cart</h2>
            <div className="divide-y divide-gray-200">
              {cart.map((item, idx) => (
                <div key={item.product?._id || item.product || idx} className="flex items-center justify-between py-6 group hover:bg-blue-50 rounded-xl transition">
                  <div className="flex items-center gap-4">
                    <img src={item.image || item.product?.image} alt={item.name || item.product?.name} className="w-20 h-20 object-contain rounded-xl bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 shadow-md" />
                    <div>
                      <div className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition">{item.name || item.product?.name}</div>
                      <div className="text-gray-500 text-sm mb-1">{item.category || item.product?.category}</div>
                      <div className="text-blue-500 font-bold text-lg">${item.price ?? item.product?.price}</div>
                      {item.description && <div className="text-gray-400 text-xs mt-1 italic">{item.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQtyChange(item.product?._id || item.product, -1)} className="p-2 rounded-full bg-gray-200 hover:bg-blue-200 transition"><FaMinus /></button>
                    <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.product?._id || item.product, 1)} className="p-2 rounded-full bg-gray-200 hover:bg-blue-200 transition"><FaPlus /></button>
                    <button onClick={() => handleDelete(item.product?._id || item.product)} className="p-2 rounded-full bg-red-100 hover:bg-red-300 text-red-500 ml-2 transition"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Billing & Payment Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-2xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Billing & Payment</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Shipping Address</span>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-gray-400 text-sm mb-2">No addresses found. <a href='/products/manage-addresses' className='text-blue-500 underline'>Add one</a> to continue.</div>
                ) : (
                  <>
                    <select value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)} className="w-full p-2 rounded border border-gray-300 mb-2">
                      <option value="">Select an address</option>
                      {addresses.map(addr => (
                        <option key={addr._id || addr.id} value={addr._id || addr.id}>
                          {addr.fullName}, {addr.address1}{addr.address2 ? ', ' + addr.address2 : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setShowAddressForm(v => !v)} className="text-blue-500 underline text-sm mb-2">{showAddressForm ? 'Cancel' : 'Add New Address'}</button>
                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 mt-2 flex flex-col gap-2 border border-gray-200">
                        <input name="fullName" value={addressForm.fullName} onChange={handleAddressFormChange} placeholder="Full Name" className="p-2 rounded border border-gray-300" required />
                        <input name="address1" value={addressForm.address1} onChange={handleAddressFormChange} placeholder="Address Line 1" className="p-2 rounded border border-gray-300" required />
                        <input name="address2" value={addressForm.address2} onChange={handleAddressFormChange} placeholder="Address Line 2 (optional)" className="p-2 rounded border border-gray-300" />
                        <input name="city" value={addressForm.city} onChange={handleAddressFormChange} placeholder="City" className="p-2 rounded border border-gray-300" required />
                        <input name="state" value={addressForm.state} onChange={handleAddressFormChange} placeholder="State" className="p-2 rounded border border-gray-300" required />
                        <input name="pincode" value={addressForm.pincode} onChange={handleAddressFormChange} placeholder="Pincode" className="p-2 rounded border border-gray-300" required />
                        <input name="phone" value={addressForm.phone} onChange={handleAddressFormChange} placeholder="Phone" className="p-2 rounded border border-gray-300" required />
                        {addressError && <div className="text-red-500 text-xs">{addressError}</div>}
                        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2 font-bold disabled:opacity-50" disabled={addressLoading}>{addressLoading ? 'Adding...' : 'Save Address'}</button>
                      </form>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Discount:</span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax:</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="text-blue-700 font-bold">Total:</span>
                  <span className="font-bold text-blue-700">${total.toFixed(2)}</span>
                </div>
              </div>
              {paymentMethod === 'stripe' ? (
                <StripePaymentForm total={total} user={user} dispatch={dispatch} createPaymentIntent={createPaymentIntent} handlePayment={handlePayment} />
              ) : (
                <form onSubmit={handlePayment} className="flex flex-col gap-4">
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="p-3 rounded border border-gray-300">
                    <option value="stripe">Stripe</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                  <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform duration-200 text-lg" disabled={!selectedAddressId}>Pay Now</button>
                </form>
              )}
              {paid && (
                <div className="mt-6 text-green-600 font-bold text-center">Payment successful! Thank you for your order.</div>
              )}
            </div>
          </div>
        </div>
      </StripeElementsProvider>
    </Elements>
  );
};

export default Cart;
