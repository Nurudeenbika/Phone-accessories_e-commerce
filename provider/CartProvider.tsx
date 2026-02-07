import { CartContextProvider } from "@/context/CartContext";
import React from "react";

interface CartProviderProps {
  children: React.ReactNode;
}

export default function CartProvider({
  children,
}: CartProviderProps): React.ReactElement {
  return <CartContextProvider>{children}</CartContextProvider>;
}
