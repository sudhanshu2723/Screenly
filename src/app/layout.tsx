import type { Metadata } from "next";
import {Manrope} from 'next/font/google'
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme";
import ReactQueryProvider from "@/react-query";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "sonner";


const manrope=Manrope({
  subsets:['latin']
})

export const metadata: Metadata = {
  title: "Screenly-AI",
  description: "Share AI powered videos with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      
      <body className={manrope.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
          <ReactQueryProvider>
         
        {children}
        <Toaster/>
        </ReactQueryProvider>
        </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}