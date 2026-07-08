import { createContext, useContext, useState } from "react";

const RestaurantContext = createContext();

// Sample seed data — replace with API data later
const initialRestaurants = [
  {
    id: "r1",
    name: "Pizza Palace",
    cuisine: "Italian",
    image: "/images/pizza-palace.jpg",
    menu: [
      { id: "i1", name: "Margherita Pizza", price: 250, category: "Pizza", isVeg: true },
      { id: "i2", name: "Pepperoni Pizza", price: 320, category: "Pizza", isVeg: false },
      { id: "i3", name: "Garlic Bread", price: 120, category: "Sides", isVeg: true },
    ],
  },
  {
    id: "r2",
    name: "Spice Route",
    cuisine: "Indian",
    image: "/images/spice-route.jpg",
    menu: [
      { id: "i4", name: "Butter Chicken", price: 280, category: "Main", isVeg: false },
      { id: "i5", name: "Paneer Tikka", price: 240, category: "Main", isVeg: true },
      { id: "i6", name: "Dal Makhani", price: 180, category: "Main", isVeg: true },
    ],
  },
];

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const getRestaurantById = (id) => restaurants.find((r) => r.id === id);

  const selectedRestaurant = selectedRestaurantId
    ? getRestaurantById(selectedRestaurantId)
    : null;

  const addRestaurant = (restaurant) => {
    setRestaurants((prev) => [...prev, restaurant]);
  };

  const updateMenuItem = (restaurantId, itemId, updates) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? {
              ...r,
              menu: r.menu.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : r
      )
    );
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurant,
        selectedRestaurantId,
        setSelectedRestaurantId,
        getRestaurantById,
        addRestaurant,
        updateMenuItem,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => useContext(RestaurantContext);