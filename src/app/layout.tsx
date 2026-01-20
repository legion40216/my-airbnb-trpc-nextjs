import { Poppins, Geist_Mono, Josefin_Slab } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import MultiModalProvider from "@/components/global-ui/modals/multi-modals/multi-modal-provider";
import AuthModalProvider from "@/components/global-ui/modals/auth-modal/auth-modal-provider";
import { TRPCReactProvider } from "@/trpc/react";

// import { TRPCReactProvider } from "@/trpc/react";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const josefinSlab = Josefin_Slab({
  subsets: ["latin"],
  variable: "--font-josefinSlab",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefinSlab.variable} 
              ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <TRPCReactProvider>
          <MultiModalProvider />
          <AuthModalProvider />
            {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
