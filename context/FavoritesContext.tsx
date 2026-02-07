"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProductAttributes } from "@/models/product.model";
import toast from "react-hot-toast";

interface FavoritesContextType {
  favoriteProducts: ProductAttributes[];
  addToFavorites: (product: ProductAttributes) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => Promise<void>;
}

interface Props {
  children: React.ReactNode;
}

export const FavoritesContext = createContext<FavoritesContextType | null>(
  null
);

export const FavoritesContextProvider = ({ children }: Props) => {
  const [favoriteProducts, setFavoriteProducts] = useState<ProductAttributes[]>(
    []
  );

  // useEffect(() => {
  //   const storage = localStorage.getItem("favoriteProducts");

  //   if (!storage) return;

  //   try {
  //     setFavoriteProducts(JSON.parse(storage));
  //   } catch {
  //     setFavoriteProducts([]);
  //   }
  // }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;

        const data = await res.json();
        setFavoriteProducts(data.products || []);
      } catch {
        setFavoriteProducts([]);
      }
    };

    loadFavorites();
  }, []);

  const addToFavorites = useCallback(async (product: ProductAttributes) => {
    setFavoriteProducts((prev) => {
      if (prev.some((fav) => fav.id === product.id)) {
        toast.error("Product is already in favorites");
        return prev;
      }

      const updated = [...prev, product];
      localStorage.setItem("favoriteProducts", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      toast.success("Added to favorites!");
    } catch {
      toast.error("Failed to save favorite");
    }
  }, []);

  const removeFromFavorites = useCallback(async (productId: string) => {
    setFavoriteProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem("favoriteProducts", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`/api/favorites?productId=${productId}`, {
        method: "DELETE",
      });

      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove favorite");
    }
  }, []);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(async () => {
    setFavoriteProducts([]);
    localStorage.setItem("favoriteProducts", JSON.stringify([]));

    try {
      await fetch("/api/favorites/clear", { method: "DELETE" });
      toast.success("All favorites cleared");
    } catch {
      toast.error("Failed to clear favorites");
    }
  }, []);

  const isFavorite = useCallback(
    (productId: string) =>
      favoriteProducts.some((product) => product.id === productId),
    [favoriteProducts]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteProducts,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within provider");
  return context;
};
