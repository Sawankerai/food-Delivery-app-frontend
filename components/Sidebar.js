"use client";

import { useRef, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Home, ShoppingCart, Heart, MessageCircle,
  FileText, User, Settings, LogOut, ChevronLeft, ChevronRight, Menu,
} from "lucide-react";
import { OrderContext } from "../context/OrderContext";

export default function Sidebar({ collapsed, setCollapsed, active, setActive }) {
  const sidebarRef = useRef(null);
  const router = useRouter();
  const { cart = [] } = useContext(OrderContext);
  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Force sidebar closed the moment we detect mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside closes sidebar (desktop hover-collapse + mobile drawer close)
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setCollapsed(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setCollapsed]);

  const menu = [
    {
      section: "MAIN",
      items: [
        { name: "Dashboard",  icon: Home,          path: "/dashboard" },
        { name: "Food Order", icon: ShoppingCart,   path: "/food-order" },
        { name: "My Orders",  icon: FileText,       path: "/orders" },
        { name: "Favorite",   icon: Heart,          path: "/favorite" },
        { name: "Message",    icon: MessageCircle,  path: "/message" },
        { name: "Bills",      icon: FileText,       path: "/bills" },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { name: "Profile",  icon: User,     path: "/profile" },
        { name: "Settings", icon: Settings, path: "/settings" },
      ],
    },
  ];

  const handleNav = (item) => {
    setActive(item.name);
    if (isMobile) setCollapsed(true); // auto-close drawer after navigating
    router.push(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const sidebarWidth = isMobile ? "260px" : (collapsed ? "78px" : "260px");
  const showCollapsedIcons = isMobile ? false : collapsed;

  return (
    <>
      {/* FLOATING HAMBURGER — mobile only, visible when drawer is closed */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            position: "fixed", top: "16px", left: "16px", zIndex: 60,
            width: "42px", height: "42px", borderRadius: "12px", border: "none",
            background: "linear-gradient(160deg, #0f0c29, #1a1a3e, #24243e)",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)", cursor: "pointer",
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* BACKDROP — mobile only, visible when drawer is open */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 40, transition: "opacity 0.3s ease",
          }}
        />
      )}

      <div
        ref={sidebarRef}
        style={{
          position: "fixed", left: 0, top: 0, height: "100vh", zIndex: 50,
          width: sidebarWidth,
          background: "linear-gradient(160deg, #0f0c29, #1a1a3e, #24243e)",
          color: "white", display: "flex", flexDirection: "column",
          borderRadius: "0 28px 28px 0",
          boxShadow: "4px 0 30px rgba(0,0,0,0.4)",
          transition: isMobile
            ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)"
            : "width 0.35s cubic-bezier(0.4,0,0.2,1)",
          transform: isMobile ? (collapsed ? "translateX(-100%)" : "translateX(0)") : "none",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: showCollapsedIcons ? "center" : "space-between",
          padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {!showCollapsedIcons && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "14px",
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", boxShadow: "0 4px 15px rgba(249,115,22,0.4)", flexShrink: 0,
              }}>🍔</div>
              <span style={{ fontSize: "18px", fontWeight: "700", whiteSpace: "nowrap" }}>BiteBuddy</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "32px", height: "32px", borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.08)", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            {isMobile ? <ChevronLeft size={18} /> : (collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)}
          </button>
        </div>

        {/* MENU */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px", scrollbarWidth: "none" }}>
          {menu.map((section, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {!showCollapsedIcons && (
                <p style={{
                  fontSize: "10px", letterSpacing: "1.2px", color: "rgba(255,255,255,0.35)",
                  marginBottom: "8px", paddingLeft: "12px", fontWeight: "600",
                }}>{section.section}</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {section.items.map((item, i) => {
                  const isActive = active === item.name;
                  return (
                    <button
                      key={i}
                      onClick={() => handleNav(item)}
                      style={{
                        display: "flex", alignItems: "center",
                        justifyContent: showCollapsedIcons ? "center" : "flex-start",
                        gap: "12px", width: "100%", height: "46px",
                        padding: showCollapsedIcons ? "0" : "0 14px",
                        borderRadius: "14px", border: "none", cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(239,68,68,0.2))"
                          : "transparent",
                        color: isActive ? "#fb923c" : "rgba(255,255,255,0.6)",
                        boxShadow: isActive ? "inset 0 0 0 1px rgba(249,115,22,0.25)" : "none",
                        position: "relative",
                      }}
                      onMouseEnter={e => {
                        if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "white"; }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }
                      }}
                    >
                      {isActive && (
                        <div style={{
                          position: "absolute", left: 0, top: "20%", height: "60%",
                          width: "3px", borderRadius: "0 4px 4px 0",
                          background: "linear-gradient(#f97316, #ef4444)",
                        }} />
                      )}
                      <item.icon size={showCollapsedIcons ? 22 : 18} />
                      {!showCollapsedIcons && (
                        <>
                          <span style={{ fontSize: "14px", fontWeight: isActive ? "600" : "400", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
                            {item.name}
                          </span>
                          {item.name === "Food Order" && totalCartItems > 0 && (
                            <span
                              style={{
                                minWidth: "22px",
                                height: "22px",
                                padding: "0 7px",
                                borderRadius: "999px",
                                background: "linear-gradient(135deg, #f97316, #ef4444)",
                                color: "white",
                                fontSize: "12px",
                                fontWeight: "800",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
                              }}
                            >
                              {totalCartItems}
                            </span>
                          )}
                        </>
                      )}
                      {showCollapsedIcons && item.name === "Food Order" && totalCartItems > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "7px",
                            right: "10px",
                            minWidth: "18px",
                            height: "18px",
                            padding: "0 5px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #f97316, #ef4444)",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "800",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
                          }}
                        >
                          {totalCartItems}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* LOGOUT at bottom */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: showCollapsedIcons ? "center" : "flex-start",
              gap: "12px", width: "100%", height: "46px",
              padding: showCollapsedIcons ? "0" : "0 14px",
              borderRadius: "14px", border: "none", cursor: "pointer",
              background: "transparent", color: "#f87171",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={showCollapsedIcons ? 22 : 18} />
            {!showCollapsedIcons && <span style={{ fontSize: "14px", fontWeight: "500" }}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}