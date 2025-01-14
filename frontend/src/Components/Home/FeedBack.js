import React from "react";

function FeedBack() {
  return (
    <section style={{minHeight : "250px"}} className="happy-clients d-flex align-items-center justify-content-center flex-column">
      <h2
        style={{ paddingTop: "10vh", paddingBottom: "5vh", fontSize: "1.5rem" }}
      >
        CLIENTS FEEDBACKS
      </h2>
      <div className="client-testimonials">
        No feedbacks yet. Be the first to share your experience with us!
      </div>
    </section>
  );
}

export default FeedBack;
