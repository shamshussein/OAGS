import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "styles/Orders.css"

export default function OrdersPage() {
  const [orders, setOrders] = useState({ history: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(); 
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
      setLoading(false);
    }
  };

  const reorder = async (order) => {
    try {
      await fetch();
      toast.success(`Reordered: ${order.items.join(", ")}`);
    } catch (error) {
      toast.error("Reorder failed.");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await fetch(`https://api.example.com/orders/${orderId}/cancel`, {
        method: "DELETE",
      });
      setOrders((prev) => ({
        ...prev,
        upcoming: prev.upcoming.filter((order) => order.id !== orderId),
      }));
      toast.error("Order Cancelled");
    } catch (error) {
      toast.error("Failed to cancel order.");
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
            <div key={order.id} className="order-card">
              <p><strong>Items:</strong> {order.items.join(", ")}</p>
              <p><strong>Date:</strong> {order.date}</p>
              <button className="btn primary" onClick={() => reorder(order)}>Reorder</button>
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
            <div key={order.id} className="order-card">
              <p><strong>Items:</strong> {order.items.join(", ")}</p>
              <p><strong>Status:</strong> {order.status}</p>
              {order.status === "Active" && (
                <button className="btn danger" onClick={() => cancelOrder(order.id)}>Cancel Order</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
