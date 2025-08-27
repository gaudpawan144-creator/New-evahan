import React, { useState } from "react";
import "./styles.css";

function App() {
  const [userName, setUserName] = useState("");
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState("");

  const OWNER_CHAT_ID = "6426997934"; // Aapka chat ID

  const handleBooking = async (e) => {
    e.preventDefault();
    const message = `New E-Rickshaw booked!\nUser: ${userName}\nFrom: ${fromPlace}\nTo: ${toPlace}`;

    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "book", message })
    });
    setStatus("Booking notification sent!");
    setUserName(""); setFromPlace(""); setToPlace("");
  };

  const handleAddMember = async () => {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_member", chat_id: OWNER_CHAT_ID, message: memberId })
    });
    setStatus(`Member ${memberId} added`);
    setMemberId("");
  };

  const handleRemoveMember = async () => {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove_member", chat_id: OWNER_CHAT_ID, message: memberId })
    });
    setStatus(`Member ${memberId} removed`);
    setMemberId("");
  };

  return (
    <div className="container">
      <h1>🛺 Book an E-Rickshaw</h1>
      <form onSubmit={handleBooking} className="form">
        <input type="text" placeholder="Your Name" value={userName} onChange={e=>setUserName(e.target.value)} required />
        <input type="text" placeholder="From" value={fromPlace} onChange={e=>setFromPlace(e.target.value)} required />
        <input type="text" placeholder="To" value={toPlace} onChange={e=>setToPlace(e.target.value)} required />
        <button type="submit">Book E-Rickshaw</button>
      </form>

      <h2>Manage Members (Owner Only)</h2>
      <input type="text" placeholder="Member Chat ID" value={memberId} onChange={e=>setMemberId(e.target.value)} />
      <button onClick={handleAddMember}>Add Member</button>
      <button onClick={handleRemoveMember}>Remove Member</button>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default App;
