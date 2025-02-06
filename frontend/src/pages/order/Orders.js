import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "styles/Orders.css";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState({ history: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch orders from the backend
  const fetchOrders = useCallback(async () => {
    try {
      if (!user || !user.userID) {
        console.error("User is not logged in or userID is missing.");
        return;
      }
  
      const response = await axios.get(
        `http://localhost:3000/api/checkout/getOrders?userId=${user.userID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
  
      // The backend returns an object with an "orders" array.
      const fetchedOrders = response.data.orders || [];
  
      // Separate orders into history and upcoming based on orderStatus.
      const history = fetchedOrders.filter(
        (order) => order.orderStatus === "completed"
      );
      const upcoming = fetchedOrders.filter(
        (order) => order.orderStatus === "pending"
      );
  
      setOrders({ history, upcoming });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders({ history: [], upcoming: [] });
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const reorder = async (order) => {
    try {
      await axios.post(
        "/api/checkout/reorder",
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(
        `Reordered: ${order.items
          .map((item) => item.product?.productName || item.bundle?.name)
          .join(", ")}`
      );
      fetchOrders();
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("Reorder failed.");
    }
  };
  

  const cancelOrder = async (orderId) => {
    try {
      await axios.post(
        `/api/checkout/cancelOrder/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchOrders();
      toast.success("Order Canceled");
    } catch (error) {
      toast.error("Failed to cancel order.");
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await axios.post(
        `/api/checkout/completedOrder/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchOrders();
      toast.success("Order Completed");
    } catch (error) {
      toast.error("Failed to complete order.");
    }
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="title">Orders</h2>

      {/* Order History */}
      <div className="section">
        <h3 className="section-title">Order History</h3>
        {orders.history.length === 0 ? (
          <p className="empty-text">No previous orders.</p>
        ) : (
          orders.history.map((order) => (
            <div key={order._id} className="order-card">
              <p>
                <strong>Items:</strong>{" "}
                {order.items
                  .map(
                    (item) =>
                      item.product?.productName || item.bundle?.name || "Unknown"
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <button
                className="btn primary"
                onClick={() => reorder(order)}
              >
                Reorder
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Orders */}
      <div className="section">
        <h3 className="section-title">Upcoming Orders</h3>
        {orders.upcoming.length === 0 ? (
          <p className="empty-text">No upcoming orders.</p>
        ) : (
          orders.upcoming.map((order) => (
            <div key={order._id} className="order-card">
              <p>
                <strong>Items:</strong>{" "}
                {order.items
                  .map(
                    (item) =>
                      item.product?.productName || item.bundle?.name || "Unknown"
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
              {order.orderStatus === "pending" && (
                <>
                  <button
                    className="btn danger"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                  <button
                    className="btn primary"
                    onClick={() => completeOrder(order._id)}
                  >
                    Complete Order
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
