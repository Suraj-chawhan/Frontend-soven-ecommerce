"use client"
import Footer from "../../Component/Footer";
import Navbar from "../../Component/Navbar/Navbar";
import "./globals.css";
import { Provider } from 'react-redux'
import { store } from "../../Component/redux/store";

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body >
        <Provider store={store}>
        <Navbar/>
        {children}
        <Footer/>
        </Provider>
      </body>
    </html>
  );
}
