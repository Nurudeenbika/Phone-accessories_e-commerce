import React from "react";
import CartContainer from "@/components/cart/CartContainer";
import CartClient from "@/app/(shop)/cart/content/CartClient";
import { getLoggedInUser } from "@/lib/jespo/queries/user";

export default async function Cart(): Promise<React.ReactElement> {
  const loggedInUser = await getLoggedInUser();

  return (
    <CartContainer>
      <CartClient loggedInUser={loggedInUser} />
    </CartContainer>
  );
}
