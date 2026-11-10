import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import * as cartApi from "../api/cartApi";
import { errorMessage } from "../api/http";
import { availableStock, sellingPrice, type Product } from "../api/productApi";
import { useAuth } from "./AuthContext";

/** The product fields the cart needs; any API product satisfies it */
export type CartProduct = Pick<Product, "_id" | "name" | "slug" | "price" | "discountedPrice" | "images"> &
  Partial<Pick<Product, "unit" | "stock" | "status" | "inventoryTracking">>;

interface CartContextType {
  cart: cartApi.Cart | null;
  isLoading: boolean;
  /** Resolves true when the item was added; failures are shown as a toast */
  addToCart: (product: CartProduct, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";
const emptyCart = (): cartApi.Cart => ({ items: [], totalAmount: 0 });

const withTotal = (items: cartApi.CartItem[]): cartApi.Cart => ({
  items,
  totalAmount: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
});

const readGuestCart = (): cartApi.Cart => {
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? withTotal(JSON.parse(saved).items ?? []) : emptyCart();
  } catch {
    return emptyCart();
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<cartApi.Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Lets clearCart wait for a guest-cart merge still in flight after sign-in
  const syncRef = useRef<Promise<void>>(Promise.resolve());

  const saveGuestCart = (items: cartApi.CartItem[]) => {
    const next = withTotal(items);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(next));
    setCart(next);
  };

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(readGuestCart());
      return;
    }
    try {
      setCart(await cartApi.getCart());
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCart(readGuestCart());
      setIsLoading(false);
      return;
    }

    // Just signed in: fold the guest cart into the account. It is taken out of
    // storage before the await so a re-run of this effect can't merge it twice.
    const guest = readGuestCart();
    localStorage.removeItem(GUEST_CART_KEY);

    setIsLoading(true);
    syncRef.current = (async () => {
      try {
        const data = guest.items.length
          ? await cartApi.mergeCart(guest.items.map(({ productId, quantity }) => ({ productId, quantity })))
          : await cartApi.getCart();
        setCart(data);
      } catch (error) {
        console.error("Cart sync error:", error);
        if (guest.items.length) localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guest));
        setCart(guest);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const addToCart = async (product: CartProduct, quantity: number = 1) => {
    try {
      if (!isAuthenticated) {
        const items = [...readGuestCart().items];
        const existing = items.find((item) => item.productId === product._id);
        const nextQuantity = (existing?.quantity ?? 0) + quantity;
        const stock = product.stock === undefined ? null : availableStock({ ...product, stock: product.stock });

        if (stock !== null && nextQuantity > stock) {
          throw new Error(
            stock > 0 ? `Only ${stock} of ${product.name} left in stock` : `${product.name} is out of stock`,
          );
        }

        if (existing) {
          existing.quantity = nextQuantity;
        } else {
          items.push({
            productId: product._id,
            name: product.name,
            price: sellingPrice(product),
            mrp: product.price,
            image: product.images[0] || "",
            quantity,
            slug: product.slug,
            unit: product.unit,
            stock,
          });
        }
        saveGuestCart(items);
      } else {
        setCart(await cartApi.addToCart(product._id, quantity));
      }

      toast.success(`${product.name.split("|")[0].trim()} added to cart`, { id: "cart-add" });
      return true;
    } catch (error) {
      toast.error(errorMessage(error), { id: "cart-add" });
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (!isAuthenticated) {
        const items = readGuestCart().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        saveGuestCart(items);
        return;
      }
      setCart(await cartApi.updateCartItem(productId, quantity));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (!isAuthenticated) {
        saveGuestCart(readGuestCart().items.filter((item) => item.productId !== productId));
        return;
      }
      setCart(await cartApi.removeFromCart(productId));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart(emptyCart());
      return;
    }
    await syncRef.current;
    setCart(emptyCart());
    try {
      await cartApi.clearCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
