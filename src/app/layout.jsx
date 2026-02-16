import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/context/Provider";
import ChatBotBadge from "@/ui/atoms/ChatBotBadge";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YathraGo",
  description: "Find your perfect travel companion and explore the world together",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="any" />
      </head>
      <body className={`inter.className`}>
        <Provider>{children}</Provider>
        <ChatBotBadge />
      </body>
    </html>
  );
}
