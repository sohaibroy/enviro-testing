"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiTestTubeFill } from "react-icons/ri";
import { VscSymbolMethod } from "react-icons/vsc";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation"; 
import { IoArrowBackOutline } from "react-icons/io5";

const ProgressNav = ({ activePage }) => {
  const router = useRouter();

  const [activeItem, setActiveItem] = useState({
    label: "",
    path: "",
    progressPercentage: "",
    disabledRoutes: [],
    icon: <></>,
  });

  const navItems = [
    {
      label: "Analytes:",
      path: "/",
      progressPercentage: "5%",
      disabledRoutes: ["/method-selection", "/quantity-selection"],
      icon: <RiTestTubeFill className="w-[1.5rem] h-[1.5rem]" />,
    },
    {
      label: "Methods:",
      path: "/method-selection",
      progressPercentage: "35%",
      disabledRoutes: ["/method-selection", "/quantity-selection"],
      icon: <VscSymbolMethod className="w-[1.5rem] h-[1.5rem]" />,
    },
    {
      label: "Quantity",
      path: "/quantity-selection",
      progressPercentage: "66%",
      disabledRoutes: ["/method-selection", "/quantity-selection"],
      icon: (
        <MdOutlineProductionQuantityLimits className="w-[1.5rem] h-[1.5rem]" />
      ),
    },
    {
      label: "Cart",
      path: "/view-cart",
      progressPercentage: "100%",
      disabledRoutes: ["/method-selection", "/quantity-selection"],
      icon: <FaShoppingCart className="w-[1.5rem] h-[1.5rem]" />,
    },
  ];

  const isFirstStep = activeItem.path === "/";

const handleBack = () => {
  const currentPath = activeItem.path;

  if (currentPath === "/view-cart") {
    const methodId = sessionStorage.getItem("selectedMethodId");
    if (methodId) {
      router.push(`/quantity-selection/${methodId}`);
    } else {
      console.warn("No selectedMethodId in sessionStorage");
      router.push("/method-selection");
    }
    return;
  }

if (currentPath.startsWith("/quantity-selection")) {
  const analyteId = sessionStorage.getItem("selectedAnalyteId");
  if (analyteId) {
    console.log("Going back to method-selection with analyteId:", analyteId);
    router.push(`/method-selection/${analyteId}`);
  } else {
    console.warn("selectedAnalyteId missing from sessionStorage.");
    // fallback to analyte list
    router.push("/"); 
  }
  return;
}

  if (currentPath.startsWith("/method-selection")) {
    router.push("/");
    return;
  }

  const currentIndex = navItems.findIndex((item) => item.path === currentPath);
  if (currentIndex > 0) {
    const previousItem = navItems[currentIndex - 1];
    router.push(previousItem.path);
  }
};

  useEffect(() => {
    const foundItem = navItems.find((item) => {
      if (activePage === "/") {
        return item.path.startsWith(activePage);
      }

      const pathParts = item.path
        .substring(1)
        .split("/")
        .filter((part) => part !== "");
      const activePageParts = activePage
        .substring(1)
        .split("/")
        .filter((part) => part !== "");

      return pathParts.some((pathPart) =>
        activePageParts.some((activePagePart) =>
          activePagePart.startsWith(pathPart)
        )
      );
    });

    if (foundItem) {
      setActiveItem((prevState) => {
        if (prevState.path !== foundItem.path) {
          return foundItem;
        }
        return prevState;
      });
    }
  }, [activePage]);

  return (
    <div className="bg-white bg-opacity-60 backdrop-filter backdrop-blur-xl overflow-hidden p-[1rem] mt-[3rem] mb-[1rem] select-none sticky top-0 z-[20]">
      <div className="max-w-[70rem] lg:mx-auto">
        <nav className="mb-[.5rem]">
          <div className="flex justify-between">
            {navItems.map((item, index) => (
              <div key={index}>
                {activeItem.path === "" ||
                activeItem.disabledRoutes.some((path) =>
                  item.path.substring(1).startsWith(path.substring(1))
                ) ? (
                  <span
                    className={`cursor-not-allowed p-2 drop-shadow-lg rounded-md font-semibold flex justify-center items-center gap-[.5rem] ${
                      activeItem.label === item.label
                        ? "font-bold bg-enviro_orange text-white drop-shadow-lg"
                        : "text-[#455f81] font-semibold"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:block">{item.label}</span>
                  </span>
                ) : (
                  <Link href={item.path} passHref>
                    <span
                      className={`cursor-pointer p-2 rounded-md ${
                        activeItem.label === item.label
                          ? "font-bold bg-enviro_orange text-white drop-shadow-lg"
                          : "text-enviro_blue drop-shadow-lg font-semibold"
                      } flex items-center gap-[.5rem] justify-center transition-all transform duration-500 hover:scale-[101%] hover:text-white hover:bg-[#003883]`}
                    >
                      {item.icon}
                      <span className="hidden sm:block">{item.label}</span>
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="border rounded-lg shadow-lg overflow-hidden bg-white">
          <div
            className="h-3 rounded-lg bg-enviro_orange bg-shadow-lg transition-all duration-500"
            style={{ width: activeItem.progressPercentage || "4%" }}
          />
        </div>

        {/* Back Button */}
        <div
          onClick={!isFirstStep ? handleBack : undefined}
          className={`w-[4.75rem] h-[2.5rem] mt-4 rounded-lg flex items-center justify-center drop-shadow-lg transition-all duration-300 ${
            isFirstStep
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-enviro_blue hover:scale-105 cursor-pointer text-white"
          }`}
        >
          <IoArrowBackOutline className="w-[1.75rem] h-[1.75rem]" />
        </div>
      </div>
    </div>
  );
};

export default ProgressNav;