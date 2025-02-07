import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedBack() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/feedbacks/getFeedbacks");
        setFeedbacks(response.data.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <section
      style={{ minHeight: "250px" }}
      className="happy-clients d-flex align-items-center justify-content-center flex-column"
    >
      <h2
        style={{ fontSize: "1.5rem" }}
      >
        CLIENTS FEEDBACKS
      </h2>
      <div className="client-testimonials">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback._id} className="testimonial">
              <h4>
                {feedback.user?.userName || "Anonymous User"}:
              </h4>{" "}
              <p>
              {feedback.feedback || "No feedback provided."}
              </p>
            </div>
          ))
        ) : (
          "No feedbacks yet. Be the first to share your experience with us!"
        )}
      </div>
    </section>
  );
}

export default FeedBack;
