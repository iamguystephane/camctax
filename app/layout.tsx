import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import { StateProvider } from "@/context/StateProvider";
import AuthProvider from "@/context/AuthProvider";
import AuthWrapper from "@/components/AuthWrapper";
import SocketProvider from "@/context/SocketProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Cameroon Tax Assistant",
  description:
    "Cameroon Tax Assistant helps small businesses manage their taxes efficiently and stay compliant with local regulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <SocketProvider>
          <AuthProvider>
            <AuthWrapper>
              <StateProvider>
                <ToastProvider>{children}</ToastProvider>
              </StateProvider>
            </AuthWrapper>
          </AuthProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
