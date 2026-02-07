"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartContextType, CartProductType } from "@/lib/jespo/types";
import toast from "react-hot-toast";

interface Props {
  [propName: string]: any;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider = (props: Props) => {
  const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const storage: any = localStorage.getItem("cartItems");
    const storageCartProducts: CartProductType[] | null = JSON.parse(storage);
    const shopPaymentIntent: any = localStorage.getItem("paymentIntent");
    const paymentIntent: string | null = JSON.parse(shopPaymentIntent);

    setCartProducts(storageCartProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, quantity } = cartProducts.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.quantity += item.quantity;

            return acc;
          },
          {
            total: 0,
            quantity: 0,
          }
        );
        setCartTotalQuantity(quantity);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart: CartProductType[];

      if (prev) {
        const existingIndex = prev.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          // Product already in cart → increase quantity
          updatedCart = prev.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // New product → add with quantity 1
          updatedCart = [...prev, { ...product, quantity: 1 }];
        }
      } else {
        updatedCart = [{ ...product, quantity: 1 }];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id !== product.id;
        });

        setCartProducts(filteredProducts);
        localStorage.setItem("cartItems", JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  const handleCartQuantityIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 99) {
        return toast.error("Oops! Maximun reached.");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const productIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );
        if (productIndex > -1) {
          updatedCart[productIndex].quantity =
            updatedCart[productIndex].quantity + 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleCartQuantityDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 1) {
        return toast.error("Oops! Minimum reached.");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const productIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );
        if (productIndex > -1) {
          updatedCart[productIndex].quantity =
            updatedCart[productIndex].quantity - 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQuantity(0);
    localStorage.setItem("cartItems", JSON.stringify(null));
  }, []);

  const handleSetPaymentIntent = useCallback((value: string | null) => {
    setPaymentIntent(value);
    localStorage.setItem("paymentIntent", JSON.stringify(value));
  }, []);

  const handleRemovePaymentIntent = useCallback(() => {
    localStorage.removeItem("paymentIntent");
    setPaymentIntent(null);
  }, []);

  const value = {
    cartTotalQuantity,
    cartTotalAmount,
    cartProducts,
    paymentIntent,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQuantityIncrease,
    handleCartQuantityDecrease,
    handleClearCart,
    handleSetPaymentIntent,
    handleRemovePaymentIntent,
  };
  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("Error fetching cart info");
  }

  return context;
};
