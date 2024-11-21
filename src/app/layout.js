"use client";
import Footer from "../../Component/Footer";
import Navbar from "../../Component/Navbar/Navbar";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../../Component/redux/store";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <SessionProvider>
            <Navbar />
            {children}
            <Footer />
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
