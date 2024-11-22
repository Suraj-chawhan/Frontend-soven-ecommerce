"use client";
import Footer from "../../Component/Footer";
import Navbar from "../../Component/Navbar/Navbar";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../../Component/redux/store";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
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
