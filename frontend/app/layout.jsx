"use client";
import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { NavBar } from "./components/navigation/NavBar";
import { Footer } from "./components/footer/Footer";
import ProgressNav from "./components/progress-nav/ProgressNav";
import { usePathname } from "next/navigation";
import Head from "next/head";
import SideNav from "./components/basic/SideNav";
import "./globals.css";
import Link from "next/link";
import ProtectedLayout from "./components/auth/ProtectedLayout";

const inter = Inter({ subsets: ["latin"] });

export const defaultMetadata = {
  title: "Enviro-Works Portal",
  description: "Enviro-Works | Portal",
};

export default function RootLayout({ children }) {
  const [metadata, setMetadata] = useState(defaultMetadata);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const currentPath = usePathname();

  const validProgressBarPaths = [
    "/method-selection",
    "/quantity-selection",
    "/view-cart",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMetadata({ ...defaultMetadata });
    }
  }, []);

  useEffect(() => {
    setIsNavOpen(false);
  }, [currentPath]);

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <script src="https://js.stripe.com/v3/?locale=en-CA"></script>
      </Head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="absolute top-[3.75rem] left-4 z-[70] bg-enviro_blue text-white px-3 py-2 rounded-md shadow-md hover:bg-enviro_blue/90"
        >
          ☰
        </button>

        <SideNav
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          title="Feature Development"
        >
          <ul className="space-y-4 text-lg">
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/multi-step-form">multi-step-form</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/customer-signup">Customer Signup</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/chain-of-custody">Chain of Custody</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/equipment-rental">Equipment Rental</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/rental-cart">Equipment Rental Cart</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/contact-page">Contact Us</Link>
            </li>
            <li className="hover:text-enviro_orange cursor-pointer">
              <Link href="/admin-selection">Admin Tools</Link>
            </li>
          </ul>
        </SideNav>

        <NavBar />
        {(currentPath === "/" ||
          validProgressBarPaths.some((path) =>
            currentPath.startsWith(path)
          )) && <ProgressNav activePage={currentPath} />}

        <main className="min-h-[65vh]">
          <ProtectedLayout>{children}</ProtectedLayout>
        </main>

        <Footer />
      </body>
    </html>
  );
}
