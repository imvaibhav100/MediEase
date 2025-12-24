import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchCart, 
  removeFromCartAsync, 
  updateCartItemAsync, 
  clearCartAsync,
  removeFromCart,
  updateCartItem,
  clearCart 
} from "../cartSlice";
import { useAuth } from "./AuthContext";
import useToast from "./useToast";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const showToast = useToast();
  const { items, totalItems, totalAmount, loading } = useSelector((state) => state.cart);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveItem = async (item) => {
    setUpdating(item.name);
    if (isAuthenticated) {
      try {
        await dispatch(removeFromCartAsync(item.name)).unwrap();
        showToast(`${item.name} removed from cart`);
      } catch (error) {
        showToast('Failed to remove item');
      }
    } else {
      dispatch(removeFromCart({ name: item.name }));
      showToast(`${item.name} removed from cart`);
    }
    setUpdating(null);
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(item.name);
    if (isAuthenticated) {
      try {
        await dispatch(updateCartItemAsync({ medicineName: item.name, quantity: newQuantity })).unwrap();
      } catch (error) {
        showToast('Failed to update quantity');
      }
    } else {
      dispatch(updateCartItem({ name: item.name, quantity: newQuantity }));
    }
    setUpdating(null);
  };

  const handleClearCart = async () => {
    if (isAuthenticated) {
      try {
        await dispatch(clearCartAsync()).unwrap();
        showToast('Cart cleared');
      } catch (error) {
        showToast('Failed to clear cart');
      }
    } else {
      dispatch(clearCart());
      showToast('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please login to checkout');
      return;
    }
    navigate('/checkout', { state: { fromCart: true, totalAmount } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0057B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-shopping-cart text-8xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any medicines yet.</p>
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

  return (
    <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-shopping-cart text-[#0057B8] mr-3"></i>
            Your Cart ({totalItems} items)
          </h1>
          <button 
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            <i className="fas fa-trash mr-2"></i> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="w-20 h-20 bg-[#F5F7FA] rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-pills text-3xl text-[#0057B8]/40"></i>
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.genericSource || 'Generic Medicine'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#0057B8] font-bold">₹{item.price}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Save 70%</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => handleUpdateQuantity(item, (item.quantity || 1) - 1)}
                    disabled={updating === item.name || (item.quantity || 1) <= 1}
                    className="px-3 py-2 text-[#0057B8] hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="px-3 py-2 font-semibold min-w-[40px] text-center">
                    {updating === item.name ? (
                      <i className="fas fa-spinner fa-spin text-sm"></i>
                    ) : (
                      item.quantity || 1
                    )}
                  </span>
                  <button 
                    onClick={() => handleUpdateQuantity(item, (item.quantity || 1) + 1)}
                    disabled={updating === item.name}
                    className="px-3 py-2 text-[#0057B8] hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => handleRemoveItem(item)}
                  disabled={updating === item.name}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{(totalAmount * 0.7).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-[#0057B8]">₹{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-bolt mr-2"></i> Proceed to Checkout
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-blue-700">
                  <i className="fas fa-truck mr-2"></i>
                  Free delivery on orders above ₹100
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-green-500 mr-1"></i> Secure Payment
                </div>
                <div className="flex items-center">
                  <i className="fas fa-undo text-blue-500 mr-1"></i> Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
