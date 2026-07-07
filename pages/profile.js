import { useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #d1d5db",
    borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb" }}>
        
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <img src="https://i.pravatar.cc/80" alt="avatar" style={{ width: "72px", height: "72px", borderRadius: "50%" }} />
          <div>
            <p style={{ fontWeight: "600", fontSize: "18px", margin: 0 }}>{name}</p>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{email}</p>
          </div>
        </div>

        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "1.5rem" }}>My Profile</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #e5e7eb", paddingTop: "1.25rem", alignItems: "center" }}>
            <button onClick={handleSave} style={{ padding: "9px 20px", backgroundColor: "#111827", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
              {saved ? "✅ Saved!" : "Save changes"}
            </button>
            <button onClick={() => router.back()} style={{ padding: "9px 16px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", cursor: "pointer", backgroundColor: "transparent" }}>
              Cancel
            </button>
            {saved && <span style={{ fontSize: "13px", color: "#16a34a" }}>Profile updated!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}