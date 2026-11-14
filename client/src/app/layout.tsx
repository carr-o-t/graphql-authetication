import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ApolloWrapper } from "@/components/ApolloWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // pages set their own title, e.g. "Log in" shows as "Log in · Corroddit"
  title: {
    default: "Corroddit",
    template: "%s · Corroddit",
  },
  description:
    "A simple GraphQL authentication app built with Next.js, Apollo and MongoDB.",
};

// colours the browser ui on mobile to match the dark background
export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <ApolloWrapper>{children}</ApolloWrapper>
            <Toaster richColors={true} theme="dark" />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
