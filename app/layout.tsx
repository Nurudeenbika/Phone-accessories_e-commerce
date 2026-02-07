import { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import CustomerCareButton from "@/components/layout/common/CustomerCareButton";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { FavoritesContextProvider } from "@/context/FavoritesContext";

export const metadata: Metadata = {
  title: "Jespo Gadgets",
  description: "Your home for quality electronic gadgets...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans flex flex-col min-h-screen text-slate-700 bg-gradient-to-br from-primary-50 to-primary-100"
        suppressHydrationWarning={true}
      >
        <AuthSessionProvider>
          <FavoritesContextProvider>
            {children}
            <CustomerCareButton />
            <ToasterProvider />
          </FavoritesContextProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
