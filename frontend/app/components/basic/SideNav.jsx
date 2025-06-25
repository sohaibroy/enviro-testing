"use client";

import React, { useEffect } from "react";
import { cn } from "@/utils/mergeCss";

export default function SideNav({
    isOpen,
    title = "Navigation",
    children,
    className,
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-y-hidden");
        };
    }, [isOpen]);

    return (
        <aside
            className={cn(
                `fixed top-40 left-0 h-[calc(100vh-4rem)] w-[16rem] sm:w-[18rem] bg-white shadow-lg p-6 flex flex-col 
        transform transition-transform duration-300 ease-out z-[60]`,
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}
        >
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-enviro_blue">{title}</h1>
            </header>

            <nav className="flex flex-col gap-4">
                {children}
            </nav>
        </aside>
    );
}
