import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useCurrency } from "../context/CurrencyContext";
import { OrderContext } from "../context/OrderContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";

export default function FoodOrder() {
  const { formatPrice } = useCurrency();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Food Order");
  const router = useRouter();
  const { orders, cart = [], changeCartQty } = useContext(OrderContext);

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#10b981";
      case "In Progress":
        return "#f59e0b";
      case "Pending":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fdf6ec" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        active={active}
        setActive={setActive}
      />

      <main
        className="main-content"
        style={{
          flex: 1,
          marginLeft: collapsed ? "78px" : "260px",
          transition: "margin-left 0.35s cubic-bezier(0.4,0,0.2,1)",
          padding: "28px",
        }}
      >
        <Topbar />

        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            marginTop: "24px",
            marginBottom: "4px",
            color: "#1a1a2e",
          }}
        >
          Food Order
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          {totalCartItems > 0
            ? `${totalCartItems} item${totalCartItems !== 1 ? "s" : ""} in your current food order`
            : orders.length > 0
              ? `You have ${orders.length} placed order${orders.length !== 1 ? "s" : ""}`
              : "No orders yet. Start ordering!"}
        </p>

        {cart.length > 0 && (
          <section style={{ marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", color: "#1a1a2e" }}>
                  Current Food Order
                </h2>
                <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "14px" }}>
                  Review your selected items, then continue to Bills for payment.
                </p>
              </div>
              <button
                onClick={() => router.push("/bills")}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  color: "white",
                  padding: "12px 18px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(249,115,22,0.25)",
                }}
              >
                Payment
              </button>
            </div>

            <div
              className="food-order-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 300px",
                gap: "20px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "18px 20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#1a1a2e" }}>
                        {item.name}
                      </p>
                      <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px" }}>
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => changeCartQty(item.name, -1)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#f3f4f6",
                          fontSize: "18px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "700" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => changeCartQty(item.name, 1)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: "linear-gradient(135deg, #f97316, #ef4444)",
                          color: "white",
                          fontSize: "18px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        +
                      </button>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "800",
                        color: "#1a1a2e",
                        minWidth: "58px",
                        textAlign: "right",
                      }}
                    >
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h3 style={{ margin: "0 0 14px", color: "#1a1a2e" }}>Bill Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#6b7280" }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#6b7280" }}>
                  <span>Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#6b7280" }}>
                  <span>Delivery</span>
                  <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#1a1a2e",
                  }}
                >
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {orders.length > 0 && (
          <section>
            <h2 style={{ margin: "0 0 16px", fontSize: "22px", color: "#1a1a2e" }}>
              Placed Orders
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
                      {order.id}
                    </span>
                    <span
                      style={{
                        background: getStatusColor(order.status),
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                      Items:
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            marginBottom: "4px",
                            paddingLeft: "8px",
                          }}
                        >
                          - {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                    {order.date} at {order.time}
                  </div>

                  <div style={{ height: "1px", background: "#e5e7eb", margin: "12px 0" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Total:</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#ff6b35" }}>
                      {typeof order.totalAmount === "number"
                        ? formatPrice(order.totalAmount)
                        : order.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cart.length === 0 && orders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9ca3af",
            }}
          >
            <p style={{ fontSize: "18px" }}>No orders placed yet</p>
            <p style={{ fontSize: "14px" }}>
              Go to Dashboard and place your first order.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}