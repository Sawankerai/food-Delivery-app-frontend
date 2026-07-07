import { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { OrderContext } from "../context/OrderContext";
import { useCurrency } from "../context/CurrencyContext";
import { useFavorites } from "../context/FavoriteContext";
import { useSearch } from "../context/SearchContext";
import { Heart } from "lucide-react";
import PaymentDetailsForm, {
  createEmptyPaymentDetails,
  getPaymentSummary,
  validatePaymentDetails,
} from "../components/PaymentDetailsForm";

const allDishes = [
  { name: "Chicken Burger", desc: "Juicy grilled chicken patty", price: 249, category: "Chicken", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
  { name: "Chicken Wings", desc: "Crispy chicken wings", price: 100, category: "Chicken", img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=1000&auto=format&fit=crop" },
  { name: "Chicken Tikka", desc: "Tandoori grilled chicken", price: 150, category: "Chicken", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop" },
  { name: "Chicken Biryani", desc: "Aromatic basmati with spices", price: 290, category: "Biryani", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop" },
  { name: "Mutton Biryani", desc: "Slow-cooked mutton biryani", price: 350, category: "Biryani", img: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?q=80&w=1000&auto=format&fit=crop" },
  { name: "Veg Biryani", desc: "Fresh vegetables in biryani", price: 150, category: "Biryani", img: "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?q=80&w=1000&auto=format&fit=crop" },
  { name: "Butter Naan", desc: "Soft naan with butter", price: 25, category: "North Ind..", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBlwFlF3NVNYcC2_Ug9i0y7R7HHStB8WVnlQ&s" },
  { name: "Dal Makhani", desc: "Creamy black lentils", price: 150, category: "North Ind..", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop" },
  { name: "Paneer Butter Masala", desc: "Rich tomato-based curry", price: 250, category: "North Ind..", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop" },
  { name: "Veg Fried Rice", desc: "Wok-tossed fried rice", price: 200, category: "Chinese", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000&auto=format&fit=crop" },
  { name: "Manchurian", desc: "Crispy balls in spicy sauce", price: 100, category: "Chinese", img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=1000&auto=format&fit=crop" },
  { name: "Spring Rolls", desc: "Golden crispy spring rolls", price: 100, category: "Chinese", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop" },
  { name: "Paneer Tikka", desc: "Grilled cottage cheese", price: 180, category: "Paneer", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1000&auto=format&fit=crop" },
  { name: "Shahi Paneer", desc: "Creamy royal paneer curry", price: 280, category: "Paneer", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop" },
  { name: "Paneer Roll", desc: "Paneer wrapped in paratha", price: 60, category: "Paneer", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop" },
  { name: "Hakka Noodles", desc: "Classic Chinese-style noodles", price: 140, category: "Noodles", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop" },
  { name: "Spicy Noodles", desc: "Hot chili noodles", price: 130, category: "Noodles", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop" },
  { name: "Schezwan Noodles", desc: "Noodles in Schezwan sauce", price: 140, category: "Noodles", img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1000&auto=format&fit=crop" },
  { name: "Italian Pizza", desc: "Crispy pizza with toppings", price: 200, category: "Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" },
  { name: "BBQ Chicken Pizza", desc: "Smoky BBQ with chicken", price: 300, category: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop" },
  { name: "Margherita Pizza", desc: "Classic tomato and cheese", price: 350, category: "Pizza", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop" },
  { name: "Egg Roll", desc: "Egg wrapped in paratha", price: 50, category: "Rolls", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop" },
  { name: "Chicken Kathi Roll", desc: "Spicy chicken in wrap", price: 110, category: "Rolls", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop" },
  { name: "Veg Frankie", desc: "Veggie-loaded frankie roll", price: 90, category: "Rolls", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop" },
  { name: "Cheese Burger", desc: "Loaded with extra cheese", price: 120, category: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
  { name: "Double Patty Burger", desc: "Double beef with sauce", price: 100, category: "Burger", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop" },
  { name: "Veg Burger", desc: "Crispy veg patty burger", price: 40, category: "Burger", img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1000&auto=format&fit=crop" },
];

const categories = ["All","Chicken","Biryani","North Ind..","Chinese","Paneer","Noodles","Pizza","Rolls","Burger"];

export default function Dashboard() {
  const { formatPrice } = useCurrency();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { searchQuery, clearSearch } = useSearch();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState(createEmptyPaymentDetails());
  const {
    addOrder,
    cart,
    addToCart: addItemToCart,
    changeCartQty,
    clearCart,
  } = useContext(OrderContext);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = normalizedSearch
    ? allDishes.filter((dish) =>
        [dish.name, dish.desc, dish.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : activeCategory === "All"
      ? allDishes
      : allDishes.filter(d => d.category === activeCategory);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const addToCart = (dish) => {
    addItemToCart(dish);
    showToast(`✅ ${dish.name} added to cart!`, "success");
  };

  const changeQty = (name, delta) => {
    changeCartQty(name, delta);
  };

  const placeOrder = () => {
    if (!paymentMethod) {
      showToast("❌ Please select a payment method", "error");
      return;
    }

    const paymentError = validatePaymentDetails(paymentMethod, paymentDetails);
    if (paymentError) {
      showToast(paymentError, "error");
      return;
    }

    const itemNames = cart.map(item => item.name);
    addOrder({
      items: itemNames,
      total: formatPrice(total),
      totalAmount: total,
      paymentMethod: paymentMethod,
      paymentDetails: getPaymentSummary(paymentMethod, paymentDetails),
    });
    
    clearCart();
    setCartOpen(false);
    setPaymentMethod("card");
    setPaymentDetails(createEmptyPaymentDetails());
    showToast("✅ Payment Successful! Order Confirmed 🎉", "success");
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ec 0%, #fef9f3 50%, #fff5ee 100%)" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive} />

      <main style={{
        flex: 1,
        marginLeft: collapsed ? "78px" : "260px",
        transition: "margin-left 0.35s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto", padding: "28px", position: "relative",
      }}>
        <Topbar />

        {/* BANNER */}
        <div style={{ marginTop: "24px", position: "relative", borderRadius: "24px", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop" alt="banner"
            style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(15,12,41,0.75) 0%, rgba(15,12,41,0.1) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px",
          }}>
            <p style={{ color: "#fb923c", fontSize: "13px", fontWeight: "600", letterSpacing: "1px", marginBottom: "8px" }}>TODAY'S SPECIAL</p>
            <h2 style={{ color: "white", fontSize: "32px", fontWeight: "800", margin: "0 0 12px", lineHeight: 1.2 }}>
              Freshly Made,<br />Just For You 🍽️
            </h2>
            <button style={{
              width: "fit-content", padding: "10px 24px", borderRadius: "50px", border: "none",
              background: "linear-gradient(135deg, #f97316, #ef4444)", color: "white",
              fontWeight: "600", fontSize: "14px", cursor: "pointer",
            }}>Order Now →</button>
          </div>
        </div>

        {/* CATEGORY */}
        <div style={{ marginTop: "36px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "16px", color: "#1a1a2e" }}>Category</h2>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
            {categories.map((item, i) => (
              <button key={i} onClick={() => setActiveCategory(item)} style={{
                minWidth: "100px", height: "52px", borderRadius: "16px",
                border: activeCategory === item ? "none" : "1.5px solid #e5e7eb",
                background: activeCategory === item ? "linear-gradient(135deg, #f97316, #ef4444)" : "white",
                color: activeCategory === item ? "white" : "#374151",
                fontWeight: activeCategory === item ? "700" : "500",
                fontSize: "14px", cursor: "pointer",
                boxShadow: activeCategory === item ? "0 6px 20px rgba(249,115,22,0.35)" : "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                transform: activeCategory === item ? "translateY(-2px)" : "none",
                whiteSpace: "nowrap", padding: "0 20px",
              }}>{item}</button>
            ))}
          </div>
        </div>

        {/* FOOD LIST */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>
                {normalizedSearch
                  ? `Search results for "${searchQuery.trim()}"`
                  : activeCategory === "All" ? "Popular Dishes" : activeCategory}
              </h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: "4px 0 0" }}>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <button style={{ background: "none", border: "none", color: "#f97316", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>See all →</button>
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "48px 24px",
                textAlign: "center",
                color: "#9ca3af",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 8px", color: "#1a1a2e", fontSize: "20px" }}>
                No dishes found
              </h3>
              <p style={{ margin: "0 0 16px" }}>
                Try searching for burger, pizza, biryani, paneer, noodles, or chicken.
              </p>
              <button
                onClick={clearSearch}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  color: "white",
                  padding: "10px 16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Clear search
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map((dish, i) => {
              const cartItem = cart.find(c => c.name === dish.name);
              const favorite = isFavorite(dish.name);
              return (
                <div key={i}
                  style={{
                    background: "white", borderRadius: "24px", overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s", cursor: "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={dish.img} alt={dish.name} style={{ width: "100%", height: "185px", objectFit: "cover", objectPosition: "center", display: "block" }} />
                    <span style={{
                      position: "absolute", top: "12px", left: "12px",
                      background: "linear-gradient(135deg, #f97316, #ef4444)",
                      color: "white", fontSize: "11px", fontWeight: "700",
                      padding: "4px 10px", borderRadius: "20px",
                    }}>{dish.tag}</span>
                    <button
                      onClick={() => toggleFavorite(dish)}
                      title={favorite ? "Remove from favorite" : "Add to favorite"}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        background: favorite ? "#fff1f2" : "rgba(255,255,255,0.9)",
                        color: favorite ? "#ef4444" : "#374151",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                      }}
                    >
                      <Heart size={18} fill={favorite ? "#ef4444" : "none"} />
                    </button>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 4px", color: "#1a1a2e" }}>{dish.name}</h3>
                    <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 16px" }}>{dish.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e" }}>{formatPrice(dish.price)}</span>

                      {cartItem ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button onClick={() => changeQty(dish.name, -1)} style={{
                            width: "32px", height: "32px", borderRadius: "50%", border: "none",
                            background: "#f3f4f6", fontSize: "18px", cursor: "pointer", fontWeight: "700",
                          }}>−</button>
                          <span style={{ fontWeight: "700", fontSize: "16px" }}>{cartItem.qty}</span>
                          <button onClick={() => changeQty(dish.name, 1)} style={{
                            width: "32px", height: "32px", borderRadius: "50%", border: "none",
                            background: "linear-gradient(135deg, #f97316, #ef4444)",
                            color: "white", fontSize: "18px", cursor: "pointer", fontWeight: "700",
                          }}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(dish)} style={{
                          padding: "9px 22px", borderRadius: "14px", border: "none",
                          background: "linear-gradient(135deg, #0f0c29, #1a1a3e)",
                          color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >+ Add</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* FLOATING CART BUTTON */}
      {totalItems > 0 && (
        <button onClick={() => setCartOpen(true)} style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 100,
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          color: "white", border: "none", borderRadius: "50px",
          padding: "14px 24px", fontSize: "15px", fontWeight: "700",
          cursor: "pointer", boxShadow: "0 8px 30px rgba(249,115,22,0.5)",
          display: "flex", alignItems: "center", gap: "10px",
          animation: "pulse 2s infinite",
        }}>
          🛒 View Cart
          <span style={{
            background: "white", color: "#f97316", borderRadius: "50%",
            width: "24px", height: "24px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "13px", fontWeight: "800",
          }}>{totalItems}</span>
        </button>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", justifyContent: "flex-end",
        }}>
          <div onClick={() => setCartOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
          }} />

          <div style={{
            position: "relative", width: "420px", height: "100vh",
            background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column", zIndex: 201,
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f3f4f6",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>🛒 Your Cart</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>{totalItems} items</p>
              </div>
              <button onClick={() => setCartOpen(false)} style={{
                border: "none", background: "#f3f4f6", borderRadius: "50%",
                width: "36px", height: "36px", fontSize: "18px", cursor: "pointer",
              }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                  <p style={{ fontSize: "48px" }}>🛒</p>
                  <p style={{ fontWeight: "500" }}>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 0", borderBottom: "1px solid #f3f4f6",
                  }}>
                    <img src={item.img} alt={item.name} style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "14px" }}>{item.name}</p>
                      <p style={{ margin: 0, color: "#f97316", fontWeight: "700", fontSize: "15px" }}>{formatPrice(item.price)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button onClick={() => changeQty(item.name, -1)} style={{
                        width: "28px", height: "28px", borderRadius: "50%", border: "none",
                        background: "#f3f4f6", fontSize: "16px", cursor: "pointer", fontWeight: "700",
                      }}>−</button>
                      <span style={{ fontWeight: "700", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => changeQty(item.name, 1)} style={{
                        width: "28px", height: "28px", borderRadius: "50%", border: "none",
                        background: "linear-gradient(135deg, #f97316, #ef4444)",
                        color: "white", fontSize: "16px", cursor: "pointer", fontWeight: "700",
                      }}>+</button>
                    </div>
                    <p style={{ margin: 0, fontWeight: "700", minWidth: "44px", textAlign: "right" }}>
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #f3f4f6", background: "#fafafa", maxHeight: "350px", overflowY: "auto" }}>
                <p style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>Bill Summary</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280" }}>
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280" }}>
                    <span>Tax (5%)</span><span>{formatPrice(tax)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280" }}>
                    <span>Delivery</span><span style={{ color: "#16a34a" }}>FREE</span>
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "17px", fontWeight: "800", color: "#1a1a2e",
                    borderTop: "1px solid #e5e7eb", paddingTop: "10px", marginTop: "4px",
                  }}>
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* PAYMENT METHOD SECTION */}
                <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "#1a1a2e" }}>
                    💳 Payment Method
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { id: "card", name: "💳 Credit/Debit Card", label: "Card" },
                      { id: "upi", name: "📱 UPI/Google Pay", label: "UPI" },
                      { id: "cod", name: "🏠 Cash on Delivery", label: "COD" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          setPaymentDetails(createEmptyPaymentDetails());
                        }}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: paymentMethod === method.id ? "2px solid #f97316" : "1px solid #e5e7eb",
                          background: paymentMethod === method.id ? "#fff5ee" : "white",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: paymentMethod === method.id ? "600" : "500",
                          color: paymentMethod === method.id ? "#f97316" : "#374151",
                          transition: "all 0.2s",
                          textAlign: "left",
                        }}
                      >
                        {method.name}
                        {paymentMethod === method.id && (
                          <span style={{ float: "right" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <PaymentDetailsForm
                    paymentMethod={paymentMethod}
                    details={paymentDetails}
                    onChange={setPaymentDetails}
                  />
                </div>

                <button onClick={placeOrder} style={{
                  width: "100%", padding: "14px", borderRadius: "16px", border: "none",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  color: "white", fontWeight: "700", fontSize: "16px", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Pay & Place Order 🎉
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "100px", right: "32px", zIndex: 300,
          background: toast.type === "success"
            ? "linear-gradient(135deg, #0f0c29, #1a1a3e)"
            : "linear-gradient(135deg, #f97316, #ef4444)",
          color: "white", padding: "16px 24px", borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          fontSize: "14px", fontWeight: "600", maxWidth: "320px",
          animation: "slideIn 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 8px 30px rgba(249,115,22,0.5); }
          50% { box-shadow: 0 8px 40px rgba(249,115,22,0.8); }
        }
      `}</style>
    </div>
  );
}
