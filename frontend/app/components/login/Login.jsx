"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/utils/session";
import { AiFillAlert } from "react-icons/ai";
import { LoadingIcon } from "../loading/LoadingIcon";
import FadeIn from "../basic/FadeIn";
import Cookies from "js-cookie";

function Login({ title, link, apiPath }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

const executeLogin = async (apiPath, email, password) => {
  setLoading(true);
  try {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.user) {
        console.log("User Data to Store:", data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("accountType", "true");
      }

      Cookies.set("token", data.token, { path: '/' });

      const isAdmin = apiPath.includes("/admin");
      Cookies.set("role", isAdmin ? "admin" : "customer", { path: '/' });

      createSession(
        data.token,
        isAdmin,
        data.expires_at,
        data.user,
        data.company_name
      );

      setTimeout(() => {
        router.push(isAdmin ? "/admin-selection" : "/multi-step-form");
      }, 200); // ✅ short delay to ensure all state/cookies are set
    } else {
      setError("Invalid Login Credentials...");
      setLoading(false);
    }
  } catch (error) {
    setError(error.message || "Something went wrong...");
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    await executeLogin(apiPath, formData.email, formData.password);
  };

  return (
    <FadeIn>
      <form
        className="bg-enviro_blue m-auto w-2/3 p-[2rem] max-w-[40rem] h-[26rem] flex flex-col justify-between drop-shadow-lg text-white rounded-2xl transition-all hover:drop-shadow-2xl hover:scale-[101%] duration-300"
        onSubmit={handleSubmit}
      >
        <section className="flex flex-col h-[4rem] justify-between">
          <div className="flex justify-between">
            <h1 className="text-white font-bold">{title || "Login"}</h1>
            <h2 className="text-enviro_blue_xlight font-bold drop-shadow-2xl">
              Enviro-Works
            </h2>
          </div>
          {error ? (
            <div className="flex gap-[.5rem] items-end justify-center drop-shadow-xl text-sm font-semibold">
              <AiFillAlert size={22} />
              <p>{error}</p>
            </div>
          ) : (
            <></>
          )}
        </section>

        <section className="flex flex-col gap-[1rem] mb-[2rem]">
          <div className="w-full">
            <p>Email</p>
            <input
              autoComplete="off"
              className="h-[2.5rem] w-full p-2 text-black rounded-md"
              placeholder="Enter your email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              autoComplete="on"
              type="password"
              className="h-[2.5rem] w-full p-2 text-black rounded-md"
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
          className={`rounded-md ${
            loading
              ? "bg-enviro_blue_xlight"
              : "bg-enviro_orange transition-all hover:scale-[101%] duration-300"
          } flex justify-center p-2 text-white w-full border-2 shadow-2xl border-white font-bold`}
        >
          {loading ? (
            <LoadingIcon
              className="h-full"
              loadingRingStyles="border-enviro_blue h-[1.5rem] w-[1.5rem]"
            />
          ) : (
            <>Submit</>
          )}
        </button>
      </form>
    </FadeIn>
  );
}

export { Login };
