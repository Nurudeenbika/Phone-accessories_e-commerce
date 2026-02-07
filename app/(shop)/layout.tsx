import { CartContextProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MainContainer from "@/components/layout/main/index";
import { getLoggedInUser } from "@/lib/jespo/queries/user";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getLoggedInUser();

  return (
    <CartContextProvider>
      <Navbar loggedInUser={loggedInUser} />
      <MainContainer>{children}</MainContainer>
      <Footer />
    </CartContextProvider>
  );
}
