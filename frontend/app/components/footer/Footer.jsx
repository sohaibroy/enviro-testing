"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { destroySession } from "@/utils/session";

function Footer({ children }) {
  const router = useRouter();
  const [accountType, setAccountType] = useState(null);

  const handleLogout = () => {
    router.push("/");
    destroySession();
    setAccountType(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccountType(sessionStorage.getItem("accountType"));
    }
  }, [
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("accountType")
      : null,
  ]);

  return (
    <footer className="bg-[#003883] py-6 px-[2rem] text-white text-sm flex flex-col justify-center shadow-xl">
      <section className="flex justify-between w-full flex-wrap md:gap-y-[2rem] sm:gap-y-[2rem] xs:gap-y-[2rem] gap-y-[2rem] max-w-[70rem] m-auto">
        <ul className="uppercase lg:w-1/5 md:w-1/2 sm:w-full w-full">
          <li className="hover:scale-[102%] duration-300">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/why-us/">Why Choose Us?</Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/contact/general-contact-info/">
              Contact Us
            </Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/qualifications/">
              Qualifications
            </Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/keep-in-touch/">
              Keep In Touch
            </Link>
          </li>
        </ul>
        <ul className="uppercase lg:w-1/5 md:w-1/2 sm:w-full w-full">
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/laboratory-services/respirable-silica/">
              Respirable Silica
            </Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/contact/service-request/">
              Service Request
            </Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/about-us/mission-statement/">
              Mission Statement
            </Link>
          </li>
          <li className="hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/website-disclaimer/">
              Website Disclaimer
            </Link>
          </li>
        </ul>
        <ul className="lg:w-1/5 md:w-1/2 sm:w-full w-full">
          <li className="flex content-center gap-2 mb-1">
            Phone:
            <Link
              href="tel:7804574652"
              className="text-[#ccffff] font-bold hover:scale-[102%] duration-300"
            >
              (780) 457-4652
            </Link>
          </li>
          <li>18949 111 Ave NW</li>
          <li>Edmonton, Alberta</li>
          <li>T5S 2X4</li>
        </ul>
        <ul className="lg:w-1/5 md:w-1/2 sm:w-full w-full">
          <li className="mb-1 text-[#ccffff] uppercase">Privacy Policy</li>
          <li className="uppercase hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/careers/">Careers</Link>
          </li>
          <li className="uppercase hover:scale-[102%] duration-300">
            <Link href="https://enviro-works.com/blog/">News</Link>
          </li>
          <li className="mt-1">© Eurofins Enviro-Works | 2024</li>
        </ul>
      </section>
      <section className="pt-16 flex w-full h-4rem justify-between items-center max-w-[70rem] m-auto">
        <div className="flex gap-4 h-[3rem] items-center">
          <h2 className="text-[#ccffff] font-bold">Enviro-Works</h2>
          <div className="h-full w-[.125rem] bg-[#ccffff]"></div>
          <Image
            src="/img/nait-logo.png"
            width={20}
            height={20}
            className="w-[2rem] h-auto"
            alt="NAIT Logo"
          />
        </div>
        {accountType === null ? (
          <Link
            className="bg-[#ee7d11] p-2 w-[10rem] border-2 shadow-2xl h-[2.5rem] rounded-md border-white font-bold text-center transition-all hover:scale-[101%]"
            href="/admin-login"
          >
            Admin Login
          </Link>
        ) : accountType === "false" ? (
          <button
            className="bg-[#ee7d11] p-2 w-[10rem] border-2 shadow-2xl h-[2.5rem] rounded-md border-white font-bold text-center transition-all hover:scale-[101%]"
            onClick={handleLogout}
          >
            Admin Logout
          </button>
        ) : (
          <></>
        )}
      </section>
    </footer>
  );
}

export { Footer };
