import { useContext, useEffect, useMemo, useState } from "react";
import { Bot, Clock, Mail, MessageCircle, Phone, Send } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { useCurrency } from "../context/CurrencyContext";
import { useFavorites } from "../context/FavoriteContext";
import { OrderContext } from "../context/OrderContext";

const hiddenStatuses = ["Delivered", "Cancelled"];
const messageStorageKey = "bitebuddy_ai_messages";

const defaultMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Hi, I am BiteBuddy AI. Ask me about your order, payment, cart, favorites, delivery, or menu.",
    time: "Now",
  },
];

const quickReplies = [
  "Where is my order?",
  "What is in my cart?",
  "Help me with payment",
  "Show my favorites",
  "Best burger?",
  "Best paneer dish?",
];

const menuKnowledge = [
  { name: "Chicken Burger", category: "burger", price: 10, tags: ["burger", "chicken", "juicy", "popular"], bestFor: "a juicy chicken burger with a classic filling" },
  { name: "Cheese Burger", category: "burger", price: 12, tags: ["burger", "cheese", "creamy"], bestFor: "extra cheese and a richer burger taste" },
  { name: "Double Patty Burger", category: "burger", price: 15, tags: ["burger", "double", "heavy", "filling"], bestFor: "a heavy meal and bigger appetite" },
  { name: "Veg Burger", category: "burger", price: 9, tags: ["burger", "veg", "vegetarian"], bestFor: "a vegetarian burger option" },
  { name: "Paneer Tikka", category: "paneer", price: 12, tags: ["paneer", "panner", "tikka", "grilled", "spicy"], bestFor: "a smoky grilled paneer starter" },
  { name: "Paneer Butter Masala", category: "paneer", price: 11, tags: ["paneer", "panner", "butter", "masala", "curry"], bestFor: "a creamy paneer curry with naan or rice" },
  { name: "Shahi Paneer", category: "paneer", price: 13, tags: ["paneer", "panner", "shahi", "creamy", "royal"], bestFor: "a rich and mildly sweet paneer curry" },
  { name: "Paneer Roll", category: "paneer", price: 8, tags: ["paneer", "panner", "roll", "wrap", "quick"], bestFor: "a quick paneer snack" },
  { name: "Chicken Biryani", category: "biryani", price: 13, tags: ["biryani", "chicken", "rice", "popular"], bestFor: "a filling spicy rice meal" },
  { name: "Mutton Biryani", category: "biryani", price: 16, tags: ["biryani", "mutton", "rice", "premium"], bestFor: "a richer biryani option" },
  { name: "Veg Biryani", category: "biryani", price: 10, tags: ["biryani", "veg", "vegetarian", "rice"], bestFor: "a vegetarian biryani option" },
  { name: "Hakka Noodles", category: "noodles", price: 9, tags: ["noodles", "chinese", "hakka"], bestFor: "classic Chinese-style noodles" },
  { name: "Schezwan Noodles", category: "noodles", price: 11, tags: ["noodles", "schezwan", "spicy"], bestFor: "spicy noodles" },
  { name: "Margherita Pizza", category: "pizza", price: 15, tags: ["pizza", "cheese", "classic"], bestFor: "classic cheese pizza" },
  { name: "BBQ Chicken Pizza", category: "pizza", price: 20, tags: ["pizza", "bbq", "chicken"], bestFor: "smoky chicken pizza" },
];

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "food items";
  return items.join(", ");
}

function getMenuMatches(query) {
  const normalizedQuery = query.replace(/panner|panir/g, "paneer");
  const matches = menuKnowledge.filter((item) =>
    item.tags.some((tag) => normalizedQuery.includes(tag))
  );

  if (/\b(cheap|budget|low price|lowest)\b/.test(normalizedQuery)) {
    return [...matches].sort((a, b) => a.price - b.price);
  }

  if (/\b(premium|best|top|special|famous)\b/.test(normalizedQuery)) {
    const premiumOrder = {
      burger: ["Chicken Burger", "Cheese Burger", "Double Patty Burger"],
      paneer: ["Paneer Tikka", "Paneer Butter Masala", "Shahi Paneer"],
      biryani: ["Chicken Biryani", "Mutton Biryani", "Veg Biryani"],
      noodles: ["Schezwan Noodles", "Hakka Noodles"],
      pizza: ["BBQ Chicken Pizza", "Margherita Pizza"],
    };

    const category = matches[0]?.category;
    if (category && premiumOrder[category]) {
      return premiumOrder[category]
        .map((name) => matches.find((item) => item.name === name))
        .filter(Boolean);
    }
  }

  return matches;
}

function createMenuRecommendation(query, formatPrice) {
  const matches = getMenuMatches(query);

  if (matches.length === 0) return "";

  const topMatches = matches.slice(0, 3);
  const [first] = topMatches;
  const alternatives = topMatches.slice(1);

  const alternativeText =
    alternatives.length > 0
      ? ` You can also try ${alternatives
          .map((item) => `${item.name} (${formatPrice(item.price)})`)
          .join(" or ")}.`
      : "";

  return `I suggest ${first.name} for you. It is best for ${first.bestFor} and costs ${formatPrice(first.price)}.${alternativeText} To buy it, go to Dashboard, search/select the dish, then press + Add.`;
}

function createBotReply(text, { activeOrders, cart, favorites, formatPrice }) {
  const query = text.toLowerCase();
  const latestOrder = activeOrders[activeOrders.length - 1];
  const cartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (/\b(h+i+|hello|hey|start)\b/.test(query)) {
    return "Hello. I am your BiteBuddy AI assistant. I can help with order status, payment, cart items, favorites, delivery, and food suggestions.";
  }

  const menuRecommendation = createMenuRecommendation(query, formatPrice);
  if (menuRecommendation) {
    return menuRecommendation;
  }

  if (/\b(order|track|status|where|placed)\b/.test(query)) {
    if (latestOrder) {
      return `Your latest active order is ${latestOrder.id}. Status: ${latestOrder.status}. Items: ${formatItems(latestOrder.items)}. Total: ${
        typeof latestOrder.totalAmount === "number"
          ? formatPrice(latestOrder.totalAmount)
          : latestOrder.total
      }.`;
    }

    if (cart.length > 0) {
      return `You have ${cartItems} item${cartItems !== 1 ? "s" : ""} in your cart. Go to Bills to complete payment and place the order.`;
    }

    return "You do not have any active order right now. Add food from Dashboard, then complete payment from Bills.";
  }

  if (/\b(cart|basket|selected)\b/.test(query)) {
    if (cart.length === 0) {
      return "Your cart is empty. Open Dashboard and press Add on any dish.";
    }

    const itemList = cart.map((item) => `${item.name} x${item.qty}`).join(", ");
    return `Your cart has ${itemList}. Current total before payment is ${formatPrice(cartTotal)}.`;
  }

  if (/\b(payment|pay|upi|card|cash|cod|bill|billing)\b/.test(query)) {
    return "For payment, open Bills and choose Credit/Debit Card, UPI/Google Pay, or Cash on Delivery. I will ask for the required details before placing the order.";
  }

  if (/\b(favorite|favourite|heart|liked)\b/.test(query)) {
    if (favorites.length === 0) {
      return "You have no favorite dishes yet. On Dashboard, tap the heart button on any dish to save it.";
    }

    return `Your favorite dishes are ${favorites.map((dish) => dish.name).join(", ")}. You can add them to cart from the Favorite page.`;
  }

  if (/\b(recommend|suggest|menu|food|eat|dish)\b/.test(query)) {
    if (favorites.length > 0) {
      return `Based on your favorites, I recommend ${favorites[0].name}. You can also try Chicken Biryani, Paneer Tikka, or Hakka Noodles.`;
    }

    return "Popular picks are Chicken Biryani, Chicken Burger, Paneer Tikka, Hakka Noodles, and Margherita Pizza.";
  }

  if (/\b(delivery|address|location|change address)\b/.test(query)) {
    return "Delivery address is collected during payment when you choose Cash on Delivery. For card or UPI orders, add your delivery note in this chat and support can follow up.";
  }

  if (/\b(cancel|refund)\b/.test(query)) {
    if (latestOrder) {
      return `I found active order ${latestOrder.id}. Cancellation/refund is not automatic yet, but I can pass this request to support. Please mention the reason for cancellation.`;
    }

    return "There is no active order to cancel. If you paid earlier, share the order ID and support will check it.";
  }

  if (/\b(thanks|thank you|ok|okay)\b/.test(query)) {
    return "You are welcome. I am here if you need help with food, orders, payment, or delivery.";
  }

  return "I can help with order tracking, cart details, payment steps, favorites, delivery, cancellation, and food recommendations. Try asking: Where is my order?";
}

export default function Message() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Message");
  const [messages, setMessages] = useState(defaultMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { formatPrice } = useCurrency();
  const { favorites } = useFavorites();
  const { orders = [], cart = [] } = useContext(OrderContext);

  const activeOrders = useMemo(
    () => orders.filter((order) => !hiddenStatuses.includes(order.status)),
    [orders]
  );

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(messageStorageKey);

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(messageStorageKey, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const now = getTime();
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanText,
      time: now,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: createBotReply(cleanText, {
          activeOrders,
          cart,
          favorites,
          formatPrice,
        }),
        time: getTime(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addMessage(draft);
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
            AI Message Bot
          </h1>
          <p style={{ color: "#9ca3af", margin: 0 }}>
            Talk with BiteBuddy AI about orders, payments, cart, favorites, and delivery.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px minmax(0, 1fr)",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          <aside
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "18px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <Bot size={26} />
            </div>
            <h2 style={{ margin: "0 0 6px", color: "#1a1a2e", fontSize: "20px" }}>
              BiteBuddy AI Bot
            </h2>
            <p style={{ margin: "0 0 18px", color: "#9ca3af", fontSize: "13px" }}>
              Instant local AI assistant for your food app.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", color: "#6b7280", fontSize: "14px" }}>
                <Clock size={18} />
                <span>Always online</span>
              </div>
              <div style={{ display: "flex", gap: "10px", color: "#6b7280", fontSize: "14px" }}>
                <Phone size={18} />
                <span>Order and delivery help</span>
              </div>
              <div style={{ display: "flex", gap: "10px", color: "#6b7280", fontSize: "14px" }}>
                <Mail size={18} />
                <span>Payment guidance</span>
              </div>
            </div>
          </aside>

          <section
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              minHeight: "560px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#1a1a2e", fontSize: "18px" }}>
                  BiteBuddy AI Chat
                </h2>
                <p style={{ margin: "4px 0 0", color: "#16a34a", fontSize: "13px", fontWeight: "600" }}>
                  Online
                </p>
              </div>
              <button
                onClick={() => setMessages(defaultMessages)}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background: "white",
                  color: "#6b7280",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Clear
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "#fffaf3",
              }}
            >
              {messages.map((message) => {
                const isUser = message.sender === "user";

                return (
                  <div
                    key={message.id}
                    style={{
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      maxWidth: "72%",
                    }}
                  >
                    <div
                      style={{
                        background: isUser
                          ? "linear-gradient(135deg, #f97316, #ef4444)"
                          : "white",
                        color: isUser ? "white" : "#1a1a2e",
                        border: isUser ? "none" : "1px solid #e5e7eb",
                        padding: "12px 14px",
                        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        fontSize: "14px",
                        lineHeight: 1.5,
                      }}
                    >
                      {message.text}
                    </div>
                    <p
                      style={{
                        margin: "4px 6px 0",
                        color: "#9ca3af",
                        fontSize: "11px",
                        textAlign: isUser ? "right" : "left",
                      }}
                    >
                      {message.time}
                    </p>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ alignSelf: "flex-start", maxWidth: "72%" }}>
                  <div
                    style={{
                      background: "white",
                      color: "#6b7280",
                      border: "1px solid #e5e7eb",
                      padding: "12px 14px",
                      borderRadius: "16px 16px 16px 4px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                      fontSize: "14px",
                    }}
                  >
                    BiteBuddy AI is typing...
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => addMessage(reply)}
                    style={{
                      border: "1px solid #fed7aa",
                      borderRadius: "999px",
                      background: "#fff7ed",
                      color: "#ea580c",
                      padding: "7px 11px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask BiteBuddy AI..."
                  style={{
                    flex: 1,
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
