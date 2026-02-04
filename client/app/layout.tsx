import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@widgets/header/Header";
import { Footer } from "@widgets/footer/Footer";
import { AuthProvider } from "@features/auth/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Detailing Volgograd | Автомойка и детейлинг в Волгограде",
    template: "%s | Detailing Volgograd",
  },
  description:
    "Профессиональная автомойка и детейлинг в Волгограде. Онлайн запись на услуги мойки кузова, химчистки салона, полировки. Качественно, быстро, недорого.",
  keywords: [
    "автомойка волгоград",
    "детейлинг волгоград",
    "мойка машины",
    "химчистка салона",
    "полировка кузова",
    "онлайн запись",
  ],
  authors: [{ name: "Detailing Volgograd" }],
  creator: "Detailing Volgograd",
  publisher: "Detailing Volgograd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Detailing Volgograd - Автомойка и детейлинг",
    description:
      "Профессиональная автомойка и детейлинг в Волгограде. Онлайн запись на услуги.",
    url: "/",
    siteName: "Detailing Volgograd",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Detailing Volgograd - Автомойка и детейлинг",
    description:
      "Профессиональная автомойка и детейлинг в Волгограде. Онлайн запись.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Добавьте после регистрации в Google Search Console
    // google: "your-verification-code",
    // yandex: "your-verification-code",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

