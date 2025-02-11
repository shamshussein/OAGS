import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "styles/Orders.css";
import API_BASE_URL from "config";

export default function OrdersPage() {
  const [orders, setOrders] = useState({ history: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = useCallback(async () => {
    try {
      if (!user || !user.userID) {
        console.error("User is not logged in or userID is missing.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/checkout/getOrders?userId=${user.userID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const fetchedOrders = response.data.orders || [];

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
    const userConfirmed = window.confirm(
      "Are you sure you want to reorder this order? This will place a new order with the same items."
    );
    if (!userConfirmed) return; 
  
    try {
      await axios.post(
        `${API_BASE_URL}/api/checkout/reorder`,
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
       `${API_BASE_URL}/api/checkout/cancelOrder/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchOrders();
      toast.success("Order canceled");
    } catch (error) {
      toast.error("Failed to cancel order.");
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/checkout/completedOrder/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Order completed");
      fetchOrders();
      setShowFeedbackPopup(true);
    } catch (error) {
      toast.error("Failed to complete order.");
    }
  };

  const submitFeedback = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/feedbacks/sendFeedback`,
        { feedback: feedbackText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setShowFeedbackPopup(false);
    } catch (error) {
      toast.error("Failed to submit feedback.");
    }
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="title">Your Orders</h2>

      <div className="orders-section">
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
                      item.product?.productName ||
                      item.bundle?.name ||
                      "Unknown"
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <button
                className="btn btn-success"
                onClick={() => reorder(order)}
              >
                Reorder
              </button>
            </div>
          ))
        )}
      </div>

      <div className="orders-section">
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
                      item.product?.productName ||
                      item.bundle?.name ||
                      "Unknown"
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
              {order.orderStatus === "pending" && (
                <div className="order-actions">
                  <button
                    className="btn danger"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => completeOrder(order._id)}
                  >
                    Complete Order
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showFeedbackPopup && (
        <div className="feedback-popup">
          <h2>We Value Your Feedback</h2>
          <p>Please share your thoughts about your recent order.</p>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Enter your feedback here..."
          />
          <div className="feedback-buttons">
            <button className="btn primary" onClick={submitFeedback}>
              Submit Feedback
            </button>
            <button
              className="btn danger"
              onClick={() => {
                setShowFeedbackPopup(false);
                setFeedbackText("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
