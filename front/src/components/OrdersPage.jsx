import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, cancelOrder } from "../api";
import { useAuth } from "./AuthContext";
import useToast from "./useToast";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const showToast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      showToast('Failed to fetch orders');
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    try {
      await cancelOrder(orderId);
      showToast('Order cancelled successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      showToast(error.response?.data || 'Failed to cancel order');
    }
    setCancelling(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return 'fa-clock';
      case 'CONFIRMED':
        return 'fa-check-circle';
      case 'SHIPPED':
        return 'fa-truck';
      case 'DELIVERED':
        return 'fa-check-double';
      case 'CANCELLED':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-lock text-8xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view your orders.</p>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0057B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <i className="fas fa-box-open text-8xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-box text-[#0057B8] mr-3"></i>
            My Orders
          </h1>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-semibold text-gray-800">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-[#0057B8]">₹{order.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    <i className={`fas ${getStatusIcon(order.status)} mr-2`}></i>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F5F7FA] rounded-lg flex items-center justify-center">
                        <i className="fas fa-pills text-[#0057B8]/40"></i>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      Shipping: {order.shippingAddress}
                    </p>
                  </div>
                )}

                {/* Payment Info */}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <i className="fas fa-wallet mr-1"></i>
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                  <span className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                    <i className={`fas ${order.paymentStatus === 'PAID' ? 'fa-check-circle' : 'fa-clock'} mr-1`}></i>
                    {order.paymentStatus === 'PAID' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>

                {/* Cancel Button */}
                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="text-red-500 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                    >
                      {cancelling === order.id ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i> Cancelling...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times mr-2"></i> Cancel Order
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
