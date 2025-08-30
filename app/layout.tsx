import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Content Calendar",
  description: "Manage your restaurant's social media content calendar",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icons/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/icons/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
              <Sidebar />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-white">
              {children}
            </main>
          </div>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'bg-white border-gray-200',
              title: 'text-gray-900',
              description: 'text-gray-600',
              success: 'bg-green-50 border-green-200',
              error: 'bg-red-50 border-red-200',
              info: 'bg-blue-50 border-blue-200',
            },
          }}
        />
      </body>
    </html>
  );
}
