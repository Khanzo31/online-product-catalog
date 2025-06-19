"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of a favorite product item. We only need basic info.
export interface FavoriteItem {
  documentId: string;
  Name: string;
  Price: number;
  imageUrl?: string;
}

// Define the shape of the context value
interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (product: FavoriteItem) => void;
  removeFavorite: (documentId: string) => void;
  isFavorite: (documentId: string) => boolean;
  favoritesCount: number;
}

// Create the context with a default undefined value
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// Define props for the provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "product_favorites";

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from local storage on initial client-side render
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItems) {
        setFavorites(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to parse favorites from local storage", error);
      setFavorites([]);
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (product: FavoriteItem) => {
    // Prevent adding duplicates
    if (!favorites.some((item) => item.documentId === product.documentId)) {
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    }
  };

  const removeFavorite = (documentId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.documentId !== documentId)
    );
  };

  const isFavorite = (documentId: string) => {
    return favorites.some((item) => item.documentId === documentId);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for easy consumption of the context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
