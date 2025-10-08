// components/layout/Layout.jsx
import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CartDrawer from "../components/cart/CartDrawer";

const Layout = ({ children }) => {
  console.log("Layout rendering children:", children);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;