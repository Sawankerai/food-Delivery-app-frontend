import { createContext, useState, useCallback, useEffect } from "react";

export const OrderContext = createContext();

function migrateSavedOrders(savedOrders) {
  return savedOrders.map((order) => {
    if (typeof order.totalAmount === "number") return order;

    const numericTotal = Number(String(order.total || "").replace(/[^0-9.]/g, ""));

    return Number.isFinite(numericTotal) && numericTotal > 0
      ? { ...order, totalAmount: numericTotal }
      : order;
  });
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("bitebuddy_orders");
      const savedCart = localStorage.getItem("bitebuddy_cart");

      if (savedOrders) {
        setOrders(migrateSavedOrders(JSON.parse(savedOrders)));
      }

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load saved food order data", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bitebuddy_orders", JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bitebuddy_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === dish.name);

      if (existingItem) {
        return prevCart.map((item) =>
          item.name === dish.name ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prevCart, { ...dish, qty: 1 }];
    });
  }, []);

  const changeCartQty = useCallback((name, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === name ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);

  const addOrder = useCallback((orderDetails) => {
    const now = new Date();

    setOrders((prevOrders) => [
      ...prevOrders,
      {
        id: `#ORD${String(prevOrders.length + 1).padStart(3, "0")}`,
        items: orderDetails.items,
        total: orderDetails.total,
        totalAmount: orderDetails.totalAmount,
        paymentMethod: orderDetails.paymentMethod,
        paymentDetails: orderDetails.paymentDetails,
        paymentStatus: "Paid",
        status: "Pending",
        date: now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        cart,
        addToCart,
        changeCartQty,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
