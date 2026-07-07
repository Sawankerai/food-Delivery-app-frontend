import { useContext } from "react";
import { useRouter } from "next/router";
import { useCurrency } from "../context/CurrencyContext";
import { OrderContext } from "../context/OrderContext";

const hiddenStatuses = ["Delivered", "Cancelled"];

const statusColor = {
  Pending: { bg: "#ffedd5", color: "#ea580c" },
  Confirmed: { bg: "#dbeafe", color: "#2563eb" },
  "In Progress": { bg: "#fef9c3", color: "#ca8a04" },
  "On the way": { bg: "#fef9c3", color: "#ca8a04" },
  Delivered: { bg: "#dcfce7", color: "#16a34a" },
  Cancelled: { bg: "#fee2e2", color: "#dc2626" },
};

export default function Orders() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { orders = [] } = useContext(OrderContext);
  const activeOrders = orders.filter((order) => !hiddenStatuses.includes(order.status));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <button
            onClick={() => router.back()}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor: "#fff",
              fontSize: "14px",
            }}
          >
            Back
          </button>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>My Orders</h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>
              {activeOrders.length > 0
                ? `${activeOrders.length} active order${activeOrders.length !== 1 ? "s" : ""}`
                : "No active orders right now"}
            </p>
          </div>
        </div>

        {activeOrders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeOrders.map((order) => {
              const colors = statusColor[order.status] || statusColor.Pending;
              const itemText = Array.isArray(order.items)
                ? order.items.join(", ")
                : order.items || "Food order";

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                    <p style={{ fontWeight: "600", fontSize: "15px", margin: 0, color: "#111827" }}>
                      {itemText}
                    </p>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                      {order.id} · {order.date}
                      {order.time ? ` at ${order.time}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                    <span
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.color,
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.status}
                    </span>
                    <p style={{ fontWeight: "700", fontSize: "15px", margin: 0, color: "#111827" }}>
                      {typeof order.totalAmount === "number"
                        ? formatPrice(order.totalAmount)
                        : order.total}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "48px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "600" }}>
              No active orders to show
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                border: "none",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                color: "white",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Order Food
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
