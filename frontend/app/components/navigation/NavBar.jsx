"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPhone } from "react-icons/fa6";
import { destroySession } from "@/utils/session";
import Cookies from "js-cookie";

// import CheckoutForm from "../CheckoutForm";
import styles from './NavBar.module.css';


//Phone number header component on main page 

function NavBar() {
  const router = useRouter();
  const [accountType, setAccountType] = useState(null);
  

const handleLogout = () => {
  // Clear session and cookie storage
  sessionStorage.clear();
  localStorage.clear(); // if used

  Cookies.remove('token', { path: '/' });
  Cookies.remove('role', { path: '/' });

  router.push('/customer-login');
};

  useEffect(() => {
    setAccountType(sessionStorage.getItem("accountType"));
  }, [
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("accountType")
      : null,
  ]);

  return (
    <header className="shadow-xl text-white">
      <section className="bg-enviro_blue flex justify-center items-center h-[2.5rem]">
        <Link
  href="tel:7804574652"
  className={`flex gap-2 p-2 justify-between items-center text-s transition-transform duration-200 hover:scale-[1.05] ${styles.phoneLink}`}
>
  <FaPhone className={styles.phoneIcon} />
  (780) 457-4652
</Link>

      </section>
      <section className="h-[100%] py-6 px-[2rem] xl:px-0 flex justify-between items-center max-w-[70rem] m-auto">
        <Link href="https://enviro-works.com/">
          <img className="h-[3.25rem]" src="/img/eurofins-logo.png" />
        </Link>
        <div className="flex gap-[1rem]">
          <Link
            className="text-enviro_blue p-2 w-[6rem] font-bold text-center transition-all hover:scale-[101%]"
            href="/"
          >
            Home
          </Link>

          <Link
  className="bg-green-600 p-2 w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
  href="/checkout"
>
  Checkout
</Link>
          {accountType === null ? (
            <>
              <Link
                className="bg-enviro_blue p-2 w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
                href="/customer-login"
              >
                Login
              </Link>
              <Link
                className="bg-enviro_orange p-2 w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
                href="/customer-signup"
              >
                Sign Up
              </Link>
            </>
          ) : accountType === "true" ? (
            <>
              <Link
                className="bg-enviro_blue p-2 w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
                href="/user-information">
                  User
              </Link>
              <button
                className="bg-enviro_orange p-2 w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </section>
    </header>
  );
}

export { NavBar };