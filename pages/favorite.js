import { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { useCurrency } from "../context/CurrencyContext";
import { useFavorites } from "../context/FavoriteContext";
import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

export default function Favorite() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Favorite");
  const [toast, setToast] = useState(null);
  const { formatPrice } = useCurrency();
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useContext(OrderContext);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (dish) => {
    addToCart(dish);
    showToast(`${dish.name} added to cart`);
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
            Favorite
          </h1>
          <p style={{ color: "#9ca3af", margin: 0 }}>
            {favorites.length > 0
              ? `${favorites.length} favorite dish${favorites.length !== 1 ? "es" : ""} saved`
              : "Tap the heart on any dashboard dish to save it here."}
          </p>
        </div>

        {favorites.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {favorites.map((dish) => (
              <div
                key={dish.name}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={dish.img}
                    alt={dish.name}
                    style={{
                      width: "100%",
                      height: "170px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#fff1f2",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    }}
                  >
                    <Heart size={18} fill="#ef4444" />
                  </span>
                </div>

                <div style={{ padding: "18px" }}>
                  <h3 style={{ margin: "0 0 6px", color: "#1a1a2e", fontSize: "18px" }}>
                    {dish.name}
                  </h3>
                  <p style={{ margin: "0 0 16px", color: "#9ca3af", fontSize: "13px" }}>
                    {dish.desc}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <strong style={{ color: "#1a1a2e", fontSize: "20px" }}>
                      {formatPrice(dish.price)}
                    </strong>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleAddToCart(dish)}
                        title="Add to cart"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          border: "none",
                          background: "linear-gradient(135deg, #f97316, #ef4444)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <ShoppingCart size={18} />
                      </button>
                      <button
                        onClick={() => removeFavorite(dish.name)}
                        title="Remove favorite"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          background: "white",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "56px 24px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#fff1f2",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Heart size={28} />
            </div>
            <h2 style={{ margin: "0 0 8px", color: "#1a1a2e" }}>No favorites yet</h2>
            <p style={{ margin: 0 }}>
              Open Dashboard and tap the heart button on dishes you like.
            </p>
          </section>
        )}

        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              zIndex: 300,
              background: "linear-gradient(135deg, #0f0c29, #1a1a3e)",
              color: "white",
              padding: "14px 20px",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
