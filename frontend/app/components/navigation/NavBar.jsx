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
    const [firstName, setFirstName] = useState("");
  

const handleLogout = () => {
  // Clear session and local/cookie data
  sessionStorage.clear();
  localStorage.clear();
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });

  // update UI state immediately dont wait for refresh page
  setAccountType(null);
  setFirstName("");

  router.push("/customer-login");
};

    useEffect(() => {
    const type = sessionStorage.getItem("accountType");
    const user = sessionStorage.getItem("user");

    setAccountType(type);

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setFirstName(parsedUser.first_name || "User");
      } catch (err) {
        console.error("Error parsing user session:", err);
      }
    }
  }, []);

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

     <section className="h-[100%] py-4 px-4 md:px-[2rem] xl:px-0 flex flex-col md:flex-row justify-between items-start md:items-center max-w-[70rem] m-auto gap-4 md:gap-0">
<Link href="https://enviro-works.com/">
<img
  src="/img/eurofins-logo.png"
  alt="Eurofins Logo"
  className="ml-12 md:ml-7 lg:ml-8
  h-[4rem] sm:h-[3.5rem] md:h-[3.5rem] lg:h-[3.25rem]
  w-auto md:w-[20rem]"
/>
</Link>

  <div className="flex flex-col sm:flex-row gap-2 sm:gap-[1rem] w-full sm:w-auto items-start sm:items-center">
    <Link
      className="text-enviro_blue p-2 w-full sm:w-[6rem] font-bold text-center transition-all hover:scale-[101%]"
      href="/"
    >
      Home
    </Link>

    <Link
      className="bg-green-600 p-2 w-full sm:w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
      href="/checkout"
    >
      Checkout
    </Link>

    {accountType === null ? (
      <>
        <Link
          className="bg-enviro_blue p-2 w-full sm:w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
          href="/customer-login"
        >
          Login
        </Link>
        <Link
          className="bg-enviro_orange p-2 w-full sm:w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
          href="/customer-signup"
        >
          Sign Up
        </Link>
      </>
    ) : accountType === "true" ? (
      <>
<Link
  className="bg-enviro_blue p-2 w-full sm:w-auto shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%] whitespace-nowrap"
  href="/user-information"
>
  Edit {firstName} Info
</Link>
        <button
          className="bg-enviro_orange p-2 w-full sm:w-[6rem] shadow-2xl font-bold text-center rounded-md transition-all hover:scale-[101%]"
          onClick={handleLogout}
        >
          Logout
        </button>
      </>
    ) : null}
  </div>
</section>
    </header>
  );
}

export { NavBar };