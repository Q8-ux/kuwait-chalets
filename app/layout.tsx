import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شاليهنا | شاليهات الكويت",
  description: "شاليهنا — دليل احترافي لمقارنة إعلانات تأجير الشاليهات في الكويت من مصادرها العامة.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
