import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as wishlistApi from "../api/wishlistApi";
import { errorMessage } from "../api/http";
import type { Product } from "../api/productApi";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  toggleWishlist: (product: Product, options?: { silent?: boolean }) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const GUEST_WISHLIST_KEY = "guest_wishlist";

const readGuestWishlist = (): Product[] => {
  try {
    const saved = localStorage.getItem(GUEST_WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const saveGuestWishlist = (next: Product[]) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
    setWishlist(next);
  };

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(readGuestWishlist());
      return;
    }
    try {
      setWishlist(await wishlistApi.getWishlist());
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist(readGuestWishlist());
      setIsLoading(false);
      return;
    }

    // Just signed in: fold the guest wishlist into the account. Taken out of
    // storage before the await so a re-run of this effect can't merge it twice.
    const guest = readGuestWishlist();
    localStorage.removeItem(GUEST_WISHLIST_KEY);

    setIsLoading(true);
    (async () => {
      try {
        setWishlist(
          guest.length
            ? await wishlistApi.mergeWishlist(guest.map((p) => p._id))
            : await wishlistApi.getWishlist(),
        );
      } catch (error) {
        console.error("Wishlist sync error:", error);
        if (guest.length) localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(guest));
        setWishlist(guest);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const isInWishlist = (productId: string) => wishlist.some((item) => item._id === productId);

  const toggleWishlist = async (product: Product, { silent = false } = {}) => {
    const wasSaved = isInWishlist(product._id);
    const next = wasSaved
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, product];

    if (!isAuthenticated) {
      saveGuestWishlist(next);
    } else {
      // Optimistic; rolled back if the server refuses
      setWishlist(next);
      try {
        await wishlistApi.toggleWishlist(product._id);
      } catch (error) {
        setWishlist(wishlist);
        toast.error(errorMessage(error));
        return;
      }
    }

    if (!silent) toast.success(wasSaved ? "Removed from wishlist" : "Saved to wishlist", { id: "wishlist" });
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
