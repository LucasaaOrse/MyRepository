
import "./globals.css";
import Header from "@/components";

export default function RootLayout({ children }) {
  return (
    <html lang="PT-br">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
