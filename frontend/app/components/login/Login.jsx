"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/utils/session";
import { AiFillAlert } from "react-icons/ai";
import { LoadingIcon } from "../loading/LoadingIcon";
import FadeIn from "../basic/FadeIn";
import Cookies from "js-cookie";

function Login({ title, link, apiPath, isAdmin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const executeLogin = async (email, password, isAdmin) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      //Get CSRF cookie for session-based login
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      //const xsrfToken = Cookies.get("XSRF-TOKEN"); // may be undefined briefly
      const csrf =
  Cookies.get("XSRF-TOKEN") ||
  (document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? "");

      // const response = await fetch(apiPath, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      //   },
      //   credentials: "include", //send/receive session cookie
      //   body: JSON.stringify({ email, password }),
      // });


const response = await fetch(apiPath, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(csrf ? { "X-XSRF-TOKEN": decodeURIComponent(csrf) } : {}),
  },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});

      if (!response.ok) {
        setError("Incorrect email or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      //Store profile info for your app
      if (data.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("accountType", "true");
      }

      //Save token for Bearer-token API calls (Option B endpoints)
      if (data.token) {
        sessionStorage.setItem("accessToken", data.token);
      }

      //(Optional) legacy cookies
      Cookies.set("token", data.token, { path: "/" });
      Cookies.set("role", isAdmin ? "admin" : "customer", { path: "/" });
      sessionStorage.setItem("role", isAdmin ? "admin" : "customer");

      //Keep your existing helper
      createSession(
        data.token,
        isAdmin,
        data.expires_at,
        data.user,
        data.company_name
      );

      setTimeout(() => {
        window.location.href = isAdmin ? "/admin-selection" : "/chain-of-custody";
      }, 200);
    } catch (err) {
      setError(err.message || "Something went wrong...");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    await executeLogin(formData.email, formData.password, isAdmin);
  };

  return (
    <FadeIn>
      <div className="w-full flex justify-center py-24">
        <div className="w-full max-w-screen-md px-4">
          <form
            className="bg-white w-full px-10 py-16 rounded-2xl shadow-xl flex flex-col gap-10 transition-all hover:shadow-2xl"
            onSubmit={handleSubmit}
          >
            <section className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {title || "Login"}
                </h1>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                  <AiFillAlert size={20} />
                  <p>{error}</p>
                </div>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <div className="w-full">
                <label className="block mb-1 text-sm font-bold text-gray-700">Email</label>
                <input
                  autoComplete="off"
                  className="h-[2.5rem] w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-enviro_blue"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 text-sm font-bold text-gray-700">Password</label>
                <input
                  autoComplete="on"
                  type="password"
                  className="h-[2.5rem] w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-enviro_blue"
                  value={formData.password}
                  onChange={handleInputChange}
                  name="password"
                  placeholder="Enter your password"
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 font-bold w-full transition-all ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-enviro_orange hover:scale-[1.02] text-white"
              }`}
            >
              {loading ? (
                <LoadingIcon
                  className="h-full"
                  loadingRingStyles="border-enviro_blue h-[1.5rem] w-[1.5rem]"
                />
              ) : (
                <>Log In</>
              )}
            </button>
          </form>
        </div>
      </div>
    </FadeIn>
  );
}

export { Login };
