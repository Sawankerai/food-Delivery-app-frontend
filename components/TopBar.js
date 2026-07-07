"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useSearch } from "../context/SearchContext";

export default function Topbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [open, setOpen] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggle = (type) => {
    setOpen((prev) => (prev === type ? null : type));
  };

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setOpen(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");

    router.push("/");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter" && searchQuery.trim() && router.pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative gap-3 w-full"
    >
      <h1 className="text-xl md:text-3xl font-bold">
        Welcome to BiteBuddy store
      </h1>

      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
        <div className="flex items-center bg-white px-3 md:px-4 py-2 rounded-full shadow flex-1 min-w-0 md:flex-none md:w-72">
          <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="What Do You Want Eat Today?"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="outline-none text-sm bg-transparent w-full min-w-0"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              type="button"
              className="ml-2 text-xs font-semibold text-gray-400 hover:text-gray-700 flex-shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => toggle("notif")}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Bell size={20} />
          </button>

          {open === "notif" && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
              <p className="font-semibold mb-2">Notifications</p>
              <p className="text-sm text-gray-500">
                No new notifications
              </p>
            </div>
          )}
        </div>

        <div className="relative flex-shrink-0 hidden sm:block">
          <button
            onClick={() => toggle("settings")}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Settings size={20} />
          </button>

          {open === "settings" && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl p-3 z-50">
              <button
                onClick={() => router.push("/settings")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
              >
                Settings Page
              </button>

              
            </div>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <button onClick={() => toggle("profile")}>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          </button>

          {open === "profile" && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl p-3 z-50">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
              >
                My Profile
              </button>

              <button
                onClick={() => router.push("/orders")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
              >
                My Orders
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-500 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}