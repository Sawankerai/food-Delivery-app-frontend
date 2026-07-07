import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext({
  favorites: [],
  toggleFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("bitebuddy_favorites");

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorite dishes", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bitebuddy_favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const isFavorite = useCallback(
    (dishName) => favorites.some((dish) => dish.name === dishName),
    [favorites]
  );

  const toggleFavorite = useCallback((dish) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => item.name === dish.name);

      if (exists) {
        return prevFavorites.filter((item) => item.name !== dish.name);
      }

      return [...prevFavorites, dish];
    });
  }, []);

  const removeFavorite = useCallback((dishName) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((dish) => dish.name !== dishName)
    );
  }, []);

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoriteContext);
}
