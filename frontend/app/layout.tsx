import { Toaster } from "sonner";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
