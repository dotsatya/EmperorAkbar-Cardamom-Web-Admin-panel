import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emperor Akbar - Admin Suite",
  description: "E-Commerce CMS & Admin Control Center for Emperor Akbar cardamom",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.className} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${poppins.className} min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delay={100}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
