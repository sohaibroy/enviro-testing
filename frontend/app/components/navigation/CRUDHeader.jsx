"use client";
import React, { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";

function CRUDHeader({ title, href }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 80;
      const hasScrolled = window.scrollY > scrollThreshold;
      setIsScrolled(hasScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="font-bold h-[12rem] sticky z-50 top-0 pointer-events-none">
      <div
        className={`flex bg-[#003883] px-[2rem] shadow-2xl pointer-events-auto transition-all ease-in-out duration-300 relative ${isScrolled ? "py-[1rem]" : "py-[3rem]"
          }`}
      >
        <Link
          className="text-white flex items-center gap-[.25rem] font-bold text-center transition-all hover:scale-[101%]"
          href={href || "/"}
        >
          <IoChevronBackOutline />
          Back
        </Link>
        <h2
          className={`text-white text-center transition-all ease-in-out duration-300 ${isScrolled
              ? "right-[2rem]"
              : "text-2xl right-[50%] translate-x-[50%]"
            } absolute top-1/2 transform -translate-y-1/2`}
        >
          {title || "Manage"}
        </h2>
      </div>
    </header>
  );
}

export { CRUDHeader };
