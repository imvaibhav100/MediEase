import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCartAsync, clearCart } from "../cartSlice";
import { createOrder, buyNow } from "../api";
import { useAuth } from "./AuthContext";
import useToast from "./useToast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const showToast = useToast();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Check if this is a Buy Now flow or Cart checkout
  const isBuyNow = location.state?.buyNow;
  const buyNowItem = location.state?.item;
  const totalAmount = isBuyNow ? location.state?.totalAmount : cartTotal;
  const items = isBuyNow ? [buyNowItem] : cartItems;

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-lock text-8xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to proceed with checkout.</p>
            <Link 
              to="/" 
              className="inline-block bg-[#0057B8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#004494] transition-colors"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-shopping-cart text-8xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items to Checkout</h2>
            <p className="text-gray-500 mb-6">Please add items to your cart first.</p>
            <Link 
              to="/medicines" 
              className="inline-block bg-[#0057B8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#004494] transition-colors"
            >
              <i className="fas fa-pills mr-2"></i> Browse Medicines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-2">Thank you for your order.</p>
            <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center text-blue-700">
                <i className="fas fa-truck mr-2"></i>
                <span>Expected delivery within 2-5 business days</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link 
                to="/orders" 
                className="bg-[#0057B8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004494] transition-colors"
              >
                <i className="fas fa-box mr-2"></i> View Orders
              </Link>
              <Link 
                to="/medicines" 
                className="border-2 border-[#0057B8] text-[#0057B8] px-6 py-3 rounded-lg font-semibold hover:bg-[#0057B8] hover:text-white transition-colors"
              >
                <i className="fas fa-pills mr-2"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      showToast('Please enter shipping address');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isBuyNow) {
        response = await buyNow(buyNowItem, shippingAddress, paymentMethod);
      } else {
        response = await createOrder(shippingAddress, paymentMethod);
      }
      
      if (response.data.success) {
        setOrderId(response.data.orderId);
        setOrderPlaced(true);
        
        // Clear cart if not buy now
        if (!isBuyNow) {
          dispatch(clearCartAsync());
        }
        
        showToast('Order placed successfully!');
      }
    } catch (error) {
      showToast(error.response?.data || 'Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-credit-card text-[#0057B8] mr-3"></i>
            Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-map-marker-alt text-[#0057B8] mr-2"></i>
                Shipping Address
              </h2>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete shipping address including city, state, and pincode..."
                className="w-full border border-gray-200 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent resize-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-wallet text-[#0057B8] mr-2"></i>
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-[#0057B8] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <i className="fas fa-hand-holding-usd text-green-500 mr-3 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-[#0057B8] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <i className="fas fa-credit-card text-[#0057B8] mr-3 text-xl"></i>
                  <div>
                    <p className="font-semibold text-gray-800">Online Payment</p>
                    <p className="text-sm text-gray-500">UPI, Cards, Net Banking</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-box text-[#0057B8] mr-2"></i>
                Order Items ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <i className="fas fa-pills text-[#0057B8]/40"></i>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-bold text-gray-800">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-[#0057B8]">₹{totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Placing Order...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i> Place Order
                  </>
                )}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                  100% Genuine Medicines
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-truck text-blue-500 mr-2"></i>
                  Free Delivery
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-undo text-orange-500 mr-2"></i>
                  Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
