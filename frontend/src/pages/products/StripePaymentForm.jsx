import React, { useContext, useState } from "react";
import { StripeElementsContext } from '../../StripeElementsContext.jsx';

const StripePaymentForm = ({ total, user, dispatch, createPaymentIntent, handlePayment }) => {
  const { elements, stripe } = useContext(StripeElementsContext);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    email: '',
    expiry: '',
    cvc: ''
  });
  const [cardError, setCardError] = useState('');

  const sendOtp = async () => {
    setOtpError('');
    if (!/^\d{10}$/.test(phone)) {
      setOtpError('Phone number must be exactly 10 digits.');
      return;
    }
    setOtpLoading(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    setTimeout(() => {
      setOtpLoading(false);
      alert(`Demo OTP sent to ${phone}: ${generatedOtp}`);
      setStep('otp');
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp === sentOtp) {
      setStep('card');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'number') val = val.replace(/\D/g, '').slice(0, 16);
    if (name === 'cvc') val = val.replace(/\D/g, '').slice(0, 4);
    if (name === 'expiry') val = val.replace(/[^\d/]/g, '').slice(0, 5);
    setCardDetails({ ...cardDetails, [name]: val });
  };

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCardError('');
    // Basic validation
    if (!cardDetails.name || !cardDetails.number || !cardDetails.email || !cardDetails.expiry || !cardDetails.cvc) {
      setCardError('Please fill all card details.');
      setProcessing(false);
      return;
    }
    // Stripe expects card info via CardElement, but for demo, just simulate success
    // In real app, use CardElement or PaymentElement for PCI compliance
    // Here, just simulate payment intent and success
    const paymentData = { amount: total, currency: 'usd' };
    const intentRes = await dispatch(createPaymentIntent(paymentData));
    const clientSecret = intentRes.payload?.clientSecret;
    if (!clientSecret) {
      setCardError('Failed to create payment intent');
      setProcessing(false);
      return;
    }
    // Simulate payment success
    setTimeout(async () => {
      setProcessing(false);
      await handlePayment(e, true);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {step === 'phone' && (
        <form onSubmit={e => { e.preventDefault(); sendOtp(); }} className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Phone Number for OTP</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} className="p-2 rounded border border-gray-300" required placeholder="Enter phone number" />
          {otpError && <div className="text-red-500 text-xs">{otpError}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2 font-bold disabled:opacity-50" disabled={otpLoading || !phone}>{otpLoading ? 'Sending OTP...' : 'Send OTP'}</button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={e => { e.preventDefault(); verifyOtp(); }} className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Enter OTP sent to {phone}</label>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="p-2 rounded border border-gray-300" required placeholder="Enter OTP" />
          {otpError && <div className="text-red-500 text-xs">{otpError}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-2 font-bold disabled:opacity-50">Verify OTP</button>
        </form>
      )}
      {step === 'card' && (
        <form onSubmit={handleStripeSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Cardholder Name</label>
          <input name="name" value={cardDetails.name} onChange={handleCardInput} className="p-2 rounded border border-gray-300" required placeholder="Cardholder Name" />
          <label className="font-semibold text-gray-700">Card Number</label>
          <input name="number" value={cardDetails.number} onChange={handleCardInput} className="p-2 rounded border border-gray-300" required placeholder="Card Number" maxLength={16} />
          <label className="font-semibold text-gray-700">Email</label>
          <input name="email" value={cardDetails.email} onChange={handleCardInput} className="p-2 rounded border border-gray-300" required placeholder="Email" type="email" />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold text-gray-700">Expiry (MM/YY)</label>
              <input name="expiry" value={cardDetails.expiry} onChange={handleCardInput} className="p-2 rounded border border-gray-300" required placeholder="MM/YY" maxLength={5} />
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-700">CVV</label>
              <input name="cvc" value={cardDetails.cvc} onChange={handleCardInput} className="p-2 rounded border border-gray-300" required placeholder="CVV" maxLength={4} />
            </div>
          </div>
          {cardError && <div className="text-red-500 text-xs">{cardError}</div>}
          <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold shadow text-lg disabled:opacity-50" disabled={processing}>{processing ? 'Processing...' : 'Pay with Card'}</button>
        </form>
      )}
    </div>
  );
};

export default StripePaymentForm;
