// components/Layout.tsx
import React from "react";
import Footer from "./footer";
import Header from "./header";
import "@/src/assets/styles/templates/base_page.scss"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;