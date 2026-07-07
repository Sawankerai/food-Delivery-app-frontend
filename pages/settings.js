import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notifications, setNotifications] = useState({ emailAlerts: true, smsAlerts: false, pushAlerts: true });
  const [billing, setBilling] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const navItems = [
    { label: "Profile", icon: "👤" },
    { label: "Security", icon: "🔒" },
    { label: "Notifications", icon: "🔔" },
    { label: "Billing", icon: "💳" },
  ];

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#374151",
    marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        borderRight: "1px solid #e5e7eb",
        padding: "2rem 1rem",
        flexShrink: 0,
        backgroundColor: "#fff",
      }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", paddingLeft: "8px" }}>
          Settings
        </p>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 10px", borderRadius: "8px", border: "none",
                textAlign: "left", fontSize: "14px", cursor: "pointer",
                fontWeight: activeTab === item.label ? "600" : "400",
                backgroundColor: activeTab === item.label ? "#f3f4f6" : "transparent",
                color: activeTab === item.label ? "#111827" : "#6b7280",
                width: "100%",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: "640px" }}>

        {/* ── PROFILE ── */}
        {activeTab === "Profile" && (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px" }}>Profile</h1>
            <p style={{ color: "#6b7280", margin: "0 0 2rem" }}>Manage your personal information.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input type="text" placeholder="John" value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input type="text" placeholder="Doe" value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="john@example.com" value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea rows={3} placeholder="Tell us about yourself..." value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          </>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "Security" && (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px" }}>Security</h1>
            <p style={{ color: "#6b7280", margin: "0 0 2rem" }}>Update your password and keep your account safe.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Current password</label>
                <input type="password" placeholder="••••••••" value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New password</label>
                <input type="password" placeholder="••••••••" value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm new password</label>
                <input type="password" placeholder="••••••••" value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "Notifications" && (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px" }}>Notifications</h1>
            <p style={{ color: "#6b7280", margin: "0 0 2rem" }}>Choose how you want to be notified.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { key: "emailAlerts", label: "Email alerts", desc: "Receive updates and alerts via email" },
                { key: "smsAlerts", label: "SMS alerts", desc: "Get text messages for important activity" },
                { key: "pushAlerts", label: "Push notifications", desc: "Browser push notifications" },
              ].map((item, i) => (
                <div key={item.key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1rem 0",
                  borderTop: i === 0 ? "1px solid #e5e7eb" : "none",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "500" }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{item.desc}</p>
                  </div>
                  <div
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                      backgroundColor: notifications[item.key] ? "#111827" : "#d1d5db",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", top: "3px",
                      left: notifications[item.key] ? "23px" : "3px",
                      width: "18px", height: "18px", borderRadius: "50%",
                      backgroundColor: "#fff", transition: "left 0.2s",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BILLING ── */}
        {activeTab === "Billing" && (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px" }}>Billing</h1>
            <p style={{ color: "#6b7280", margin: "0 0 2rem" }}>Manage your payment information.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Name on card</label>
                <input type="text" placeholder="John Doe" value={billing.cardName}
                  onChange={(e) => setBilling({ ...billing, cardName: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Card number</label>
                <input type="text" placeholder="1234 5678 9012 3456" value={billing.cardNumber}
                  onChange={(e) => setBilling({ ...billing, cardNumber: e.target.value })}
                  style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Expiry date</label>
                  <input type="text" placeholder="MM/YY" value={billing.expiry}
                    onChange={(e) => setBilling({ ...billing, expiry: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input type="text" placeholder="123" value={billing.cvv}
                    onChange={(e) => setBilling({ ...billing, cvv: e.target.value })}
                    style={inputStyle} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SAVE / CANCEL ── */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.25rem", marginTop: "2rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 20px", backgroundColor: "#111827", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer",
            }}
          >
            {saved ? "✅ Saved!" : "Save changes"}
          </button>
          <button
            onClick={() => setActiveTab(activeTab)}
            style={{
              padding: "8px 16px", backgroundColor: "transparent",
              border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {saved && <span style={{ fontSize: "13px", color: "#16a34a" }}>Changes saved successfully.</span>}
        </div>
      </main>
    </div>
  );
}