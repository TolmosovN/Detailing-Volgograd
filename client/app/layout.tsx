import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@widgets/header/Header";
import { Footer } from "@widgets/footer/Footer";
import { AuthProvider } from "@features/auth/context/AuthContext";

export const metadata: Metadata = {
  title: "Автомойка Detailing Volgograd",
  description: "Онлайн-запись на автомойку и детейлинг в Волгограде"
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

