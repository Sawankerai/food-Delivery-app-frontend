import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Decorative shapes for the right panel
const FloatingShape = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full opacity-20 blur-xl ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const FingerIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="32" r="30" stroke="white" strokeWidth="2" strokeDasharray="4 2"/>
    <circle cx="32" cy="32" r="20" stroke="white" strokeWidth="2"/>
    <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="2"/>
    <circle cx="32" cy="32" r="4" fill="white"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    // Mock auth — accept any valid-looking email/password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Store mock user
    const userData = {
      id: "user_001",
      name: isLogin ? email.split("@")[0] : name,
      email,
      role: "admin",
      permissions: {
        users: { view: true, edit: true, delete: false },
        content: { view: true, edit: true, delete: true },
        analytics: { view: true, edit: false, delete: false },
        settings: { view: true, edit: true, delete: false },
        billing: { view: false, edit: false, delete: false },
      },
      avatar: null,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    if (rememberMe) localStorage.setItem("rememberMe", "true");

    setLoading(false);
    router.push("/dashboard");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-violet-50 p-4">
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex animate-fade-in"
        style={{ minHeight: "600px" }}
      >
        {/* LEFT — Form Panel */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center animate-slide-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">Finnger</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl text-gray-900 leading-tight">
              {isLogin ? (
                <>Holla,<br /><span className="text-violet-600">Welcome Back</span></>
              ) : (
                <>Create Your<br /><span className="text-violet-600">Account</span></>
              )}
            </h1>
            <p className="text-gray-400 mt-3 font-body text-sm">
              {isLogin
                ? "Hey, welcome back to your special place"
                : "Join us and get started today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative animate-slide-up">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-body placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-body placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-body placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      rememberMe ? "bg-violet-600 border-violet-600" : "border-gray-300"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 font-body">Remember me</span>
                </label>
                <button type="button" className="text-sm text-violet-600 hover:text-violet-800 font-medium font-body transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-display font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400 font-body">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-violet-600 hover:text-violet-800 font-semibold transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {/* RIGHT — Illustration Panel */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #c084fc 100%)" }}>
          
          {/* Decorative blobs */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"/>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"/>

          {/* Cloud shapes */}
          {[
            { top: "8%", right: "10%", w: 80, h: 40 },
            { top: "15%", left: "5%", w: 60, h: 30 },
            { bottom: "12%", right: "8%", w: 90, h: 45 },
            { bottom: "20%", left: "3%", w: 70, h: 35 },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute bg-white/25 rounded-full animate-float"
              style={{
                width: c.w,
                height: c.h,
                top: c.top,
                right: c.right,
                bottom: c.bottom,
                left: c.left,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {/* Central card */}
          <div className="relative z-10 flex flex-col items-center text-white animate-float" style={{ animationDelay: "0.2s" }}>
            {/* Phone mockup */}
            <div className="w-44 h-80 rounded-3xl border-4 border-white/40 bg-gradient-to-br from-pink-300/40 to-violet-500/40 backdrop-blur-sm shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              {/* Status bar dots */}
              <div className="absolute top-4 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                <div className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                <div className="w-1.5 h-1.5 rounded-full bg-white/60"/>
              </div>
              
              {/* Fingerprint */}
              <div className="w-20 h-20">
                <FingerIcon />
              </div>
              
              {/* Progress bar */}
              <div className="w-28 h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="h-full w-3/5 bg-white/70 rounded-full"/>
              </div>

              <p className="text-white/70 text-xs mt-3 text-center px-4">
                Please tap your finger to your phone
              </p>

              {/* Settings icon */}
              <div className="absolute top-12 right-4 text-white/60">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13H11v-2h2v2zm0-4H11V7h2v4z"/>
                </svg>
              </div>
            </div>

            {/* Lock badge */}
            <div className="absolute -right-6 top-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-xl">
              <div className="w-7 h-7"><LockIcon /></div>
            </div>

            {/* Check badge */}
            <div className="absolute -left-10 top-1/2 w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: "1s" }}>
              <svg className="w-7 h-7 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-10 text-center text-white/80">
            <p className="text-sm font-body">Secure • Fast • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
