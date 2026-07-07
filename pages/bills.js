import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { useCurrency } from "../context/CurrencyContext";
import { OrderContext } from "../context/OrderContext";
import PaymentDetailsForm, {
  createEmptyPaymentDetails,
  getPaymentSummary,
  paymentLabels,
  paymentMethods,
  validatePaymentDetails,
} from "../components/PaymentDetailsForm";

export default function Bills() {
  const { formatPrice } = useCurrency();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Bills");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState(createEmptyPaymentDetails());
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const { orders, addOrder, cart = [], changeCartQty, clearCart } = useContext(OrderContext);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showToast("Add food items before payment.", "error");
      return;
    }

    const paymentError = validatePaymentDetails(paymentMethod, paymentDetails);
    if (paymentError) {
      showToast(paymentError, "error");
      return;
    }

    addOrder({
      items: cart.map((item) => item.name),
      total: formatPrice(total),
      totalAmount: total,
      paymentMethod,
      paymentDetails: getPaymentSummary(paymentMethod, paymentDetails),
    });

    clearCart();
    setPaymentMethod("card");
    setPaymentDetails(createEmptyPaymentDetails());
    showToast("Payment successful. Order confirmed.", "success");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fdf6ec" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive} />
      <main
        style={{
          flex: 1,
          marginLeft: collapsed ? "78px" : "260px",
          transition: "margin-left 0.35s cubic-bezier(0.4,0,0.2,1)",
          padding: "28px",
        }}
      >
        <Topbar />

        <div style={{ marginTop: "24px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 4px" }}>
            Bills
          </h1>
          <p style={{ color: "#9ca3af", margin: 0 }}>
            {cart.length > 0
              ? `${totalItems} item${totalItems !== 1 ? "s" : ""} ready for payment`
              : "Your billing history will appear here."}
          </p>
        </div>

        {cart.length > 0 ? (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 360px",
              gap: "24px",
              alignItems: "start",
              marginBottom: "36px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h2 style={{ margin: 0, color: "#1a1a2e", fontSize: "22px" }}>Current Bill</h2>
                  <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "14px" }}>
                    Items selected from Dashboard and Food Order.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/food-order")}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "white",
                    color: "#374151",
                    padding: "10px 14px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Edit Items
                </button>
              </div>

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
                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "700" }}>{item.qty}</span>
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
                  <p style={{ margin: 0, fontWeight: "800", minWidth: "58px", textAlign: "right", color: "#1a1a2e" }}>
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <aside
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2 style={{ margin: "0 0 16px", color: "#1a1a2e", fontSize: "22px" }}>Payment</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setPaymentDetails(createEmptyPaymentDetails());
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: paymentMethod === method.id ? "2px solid #f97316" : "1px solid #e5e7eb",
                      background: paymentMethod === method.id ? "#fff5ee" : "white",
                      color: paymentMethod === method.id ? "#f97316" : "#374151",
                      fontWeight: paymentMethod === method.id ? "700" : "500",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {method.name}
                    {paymentMethod === method.id && <span style={{ float: "right" }}>Selected</span>}
                  </button>
                ))}
              </div>

              <PaymentDetailsForm
                paymentMethod={paymentMethod}
                details={paymentDetails}
                onChange={setPaymentDetails}
              />

              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#6b7280" }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#6b7280" }}>
                  <span>Tax (18%)</span>
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
                    marginBottom: "16px",
                  }}
                >
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  color: "white",
                  padding: "14px",
                  fontWeight: "800",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(249,115,22,0.25)",
                }}
              >
                Pay & Place Order
              </button>
            </aside>
          </section>
        ) : (
          <section
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "40px 20px",
              textAlign: "center",
              color: "#9ca3af",
              marginBottom: "36px",
            }}
          >
            <p style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "700", color: "#6b7280" }}>
              No pending bill
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                border: "none",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                color: "white",
                padding: "12px 18px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Add Food
            </button>
          </section>
        )}

        {orders.length > 0 && (
          <section>
            <h2 style={{ margin: "0 0 16px", fontSize: "22px", color: "#1a1a2e" }}>Billing History</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    padding: "18px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <strong style={{ color: "#1a1a2e" }}>{order.id}</strong>
                    <span style={{ color: "#16a34a", fontWeight: "700", fontSize: "13px" }}>
                      {order.paymentStatus || "Paid"}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: "14px" }}>
                    {order.items.join(", ")}
                  </p>
                  <p style={{ margin: "0 0 8px", color: "#9ca3af", fontSize: "13px" }}>
                    {order.date} at {order.time}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
                    <span style={{ color: "#6b7280" }}>
                      {paymentLabels[order.paymentMethod] || "Payment"}
                    </span>
                    <strong style={{ color: "#ff6b35" }}>
                      {typeof order.totalAmount === "number"
                        ? formatPrice(order.totalAmount)
                        : order.total}
                    </strong>
                  </div>
                  {order.paymentDetails && (
                    <p style={{ margin: "8px 0 0", color: "#9ca3af", fontSize: "12px" }}>
                      {order.paymentDetails}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              zIndex: 300,
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #0f0c29, #1a1a3e)"
                  : "linear-gradient(135deg, #f97316, #ef4444)",
              color: "white",
              padding: "16px 24px",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {toast.msg}
          </div>
        )}
      </main>
    </div>
  );
}
