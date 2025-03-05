// app/layout.js
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "E-Commerce Store",
  description: "Modern e-commerce store with discount functionality",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">{children}</main>
          <footer className="footer">
            <p>&copy; 2025 E-Commerce Store</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
