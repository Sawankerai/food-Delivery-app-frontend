import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// ---- Icons (inline SVG, no external deps) ----
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Cook / chef mascot, echoing the reference art style
const ChefMascot = () => (
  <svg viewBox="0 0 200 200" className="w-36 h-36 relative z-10">
    <circle cx="100" cy="100" r="95" fill="#FCEFD1" />
    {/* toque */}
    <path d="M70 70c0-16 13-26 30-26s30 10 30 26c8 2 14 9 14 18 0 3-1 6-2 8H58c-1-2-2-5-2-8 0-9 6-16 14-18z" fill="#FFFFFF" stroke="#111" strokeWidth="3" />
    {/* face */}
    <circle cx="100" cy="102" r="30" fill="#FFD9B3" stroke="#111" strokeWidth="3" />
    <circle cx="90" cy="100" r="3" fill="#111" />
    <circle cx="112" cy="100" r="3" fill="#111" />
    <path d="M92 112c4 4 12 4 16 0" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    {/* body / apron */}
    <path d="M62 165c4-30 18-40 38-40s34 10 38 40z" fill="#3D3D3D" />
    <path d="M78 145h44v22H78z" fill="#E8442F" />
    {/* spoon */}
    <rect x="128" y="118" width="6" height="34" rx="3" fill="#8B5A2B" transform="rotate(20 128 118)" />
  </svg>
);

// Floating background decorations (food emoji), matching reference art
const FloatingDecor = () => (
  <>
    <span className="floating-decor" style={{ top: "6%", left: "5%", fontSize: "48px", animationDelay: "0s" }}>🍕</span>
    <span className="floating-decor" style={{ top: "12%", right: "6%", fontSize: "56px", animationDelay: "1.1s" }}>🍔</span>
    <span className="floating-decor" style={{ top: "36%", left: "3%", fontSize: "40px", animationDelay: "2s" }}>🥤</span>
    <span className="floating-decor" style={{ top: "42%", right: "4%", fontSize: "46px", animationDelay: "0.6s" }}>🍟</span>
    <span className="floating-decor" style={{ bottom: "8%", left: "6%", fontSize: "48px", animationDelay: "1.7s" }}>🍅</span>
    <span className="floating-decor" style={{ bottom: "10%", right: "8%", fontSize: "42px", animationDelay: "2.4s" }}>🥬</span>
    <style jsx>{`
      .floating-decor {
        position: absolute;
        z-index: 0;
        filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
        animation: floatDecor 6s ease-in-out infinite;
        pointer-events: none;
        user-select: none;
      }
      @keyframes floatDecor {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-14px) rotate(-4deg); }
      }
      @media (max-width: 480px) {
        .floating-decor { display: none; }
      }
    `}</style>
  </>
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
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "apple" | "facebook" | null
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

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

  // Mock social login — simulates OAuth round trip then signs the user in
  const handleSocialLogin = async (provider) => {
    setError("");
    setSocialLoading(provider);

    await new Promise((r) => setTimeout(r, 1000));

    const userData = {
      id: `user_${provider}_001`,
      name: provider.charAt(0).toUpperCase() + provider.slice(1) + " User",
      email: `${provider}user@example.com`,
      role: "admin",
      permissions: {
        users: { view: true, edit: true, delete: false },
        content: { view: true, edit: true, delete: true },
        analytics: { view: true, edit: false, delete: false },
        settings: { view: true, edit: true, delete: false },
        billing: { view: false, edit: false, delete: false },
      },
      avatar: null,
      provider,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setSocialLoading(null);
    router.push("/dashboard");
  };

  const openForgotPassword = () => {
    setError("");
    setForgotEmail(email);
    setForgotSent(false);
    setShowForgot(true);
  };

  const closeForgotPassword = () => {
    setShowForgot(false);
    setForgotSent(false);
    setForgotEmail("");
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setError("Please enter a valid email to reset your password.");
      return;
    }
    setError("");
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setForgotLoading(false);
    setForgotSent(true);
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 10%, #FFE9C7 0%, #FFDDAF 35%, #FFEAD2 65%, #FFF6E8 100%)",
      }}
    >
      <FloatingDecor />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header, above the card */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md"
            style={{
              background: "linear-gradient(135deg, #FF9800, #FF6D00)",
              boxShadow: "0 4px 12px rgba(255,109,0,0.35)",
            }}
          >
            B
          </div>
          <span className="font-display font-extrabold text-2xl text-gray-900">
            Bite<span style={{ color: "#FF6D00" }}>Buddy</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden animate-fade-in">
          {/* Header illustration band */}
          <div
            className="relative flex flex-col items-center pt-8 pb-6 px-8"
            style={{ background: "linear-gradient(180deg, #FDF3DA 0%, #FCEFD1 100%)" }}
          >
            <h1 className="font-display font-extrabold text-4xl text-gray-900 tracking-tight">
              {isLogin ? "Hello!" : "Sign Up"}
            </h1>
            {isLogin && (
              <>
                <p className="text-gray-500 text-sm mt-1 font-body">
                  Welcome to BiteBuddy
                </p>
                <p className="text-sm mt-1 font-semibold font-body" style={{ color: "#FF6D00" }}>
                  Delicious food is waiting for you 😍
                </p>
              </>
            )}

            {/* Mascot with glow + sparkles */}
            <div className="relative flex items-center justify-center mt-5 mb-1">
              <div
                className="absolute rounded-full"
                style={{
                  width: "210px",
                  height: "210px",
                  background:
                    "radial-gradient(circle, rgba(255,200,80,0.9) 0%, rgba(255,190,70,0.55) 45%, rgba(255,190,70,0) 72%)",
                }}
              />
              <span className="sparkle" style={{ top: "6%", left: "16%", fontSize: "16px" }}>✦</span>
              <span className="sparkle" style={{ top: "18%", right: "12%", fontSize: "20px", animationDelay: "0.6s" }}>✦</span>
              <span className="sparkle" style={{ bottom: "16%", left: "8%", fontSize: "16px", animationDelay: "1.2s" }}>✦</span>
              <span className="sparkle" style={{ bottom: "8%", right: "18%", fontSize: "13px", animationDelay: "1.8s" }}>✦</span>
              <ChefMascot />
            </div>
          </div>

          {/* Form section */}
          <div className="px-8 pt-6 pb-8">
            {showForgot ? (
              <>
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 font-body transition-colors"
                >
                  ← Back to login
                </button>
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-400 mb-5 font-body">
                  Enter your email and we'll send you a link to reset your password.
                </p>

                {forgotSent ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl font-body">
                    A reset link has been sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5 font-body">Email</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <MailIcon />
                        </span>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-full bg-orange-50/40 border border-orange-100 text-gray-800 text-sm font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-body">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full font-display font-bold py-3.5 rounded-full transition-all duration-200 text-sm tracking-wide text-white shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #FFC107, #FF6D00)",
                        boxShadow: "0 10px 24px rgba(255,109,0,0.35)",
                      }}
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-5">
              {isLogin ? "Login" : "Create Account"}
            </h2>
            {isLogin && (
              <p className="text-sm text-gray-400 -mt-4 mb-5 font-body">
                Welcome back! Please login to continue 👋
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-body">Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-full bg-orange-50/40 border border-orange-100 text-gray-800 text-sm font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-body">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="muhammad04@gmail.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-orange-50/40 border border-orange-100 text-gray-800 text-sm font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-body">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-full bg-orange-50/40 border border-orange-100 text-gray-800 text-sm font-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      rememberMe ? "border-transparent" : "border-gray-300"
                    }`}
                    style={rememberMe ? { background: "linear-gradient(135deg, #FFC107, #FF6D00)" } : {}}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 font-body">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-sm font-semibold font-body transition-colors"
                  style={{ color: "#FF6D00" }}
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-body">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-display font-bold py-3.5 rounded-full transition-all duration-200 text-sm tracking-wide text-white shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #FFC107, #FF6D00)",
                  boxShadow: "0 10px 24px rgba(255,109,0,0.35)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔒 {isLogin ? "Login" : "Create Account"}
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-orange-100" />
              <span className="text-xs text-gray-400 font-body whitespace-nowrap">Or continue with</span>
              <div className="flex-1 h-px bg-orange-100" />
            </div>

            {/* Social buttons — labeled pills */}
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-orange-100 text-sm font-semibold text-gray-800 hover:bg-orange-50 transition-colors disabled:opacity-50 font-body"
              >
                {socialLoading === "google" ? (
                  <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1C3.24 21.3 7.28 24 12 24z" />
                      <path fill="#FBBC05" d="M5.27 14.28A7.19 7.19 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.26A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.26 5.38l4.01-3.1z" />
                      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.26 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
                    </svg>
                    Google
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                disabled={socialLoading !== null}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-orange-100 text-sm font-semibold text-gray-800 hover:bg-orange-50 transition-colors disabled:opacity-50 font-body"
              >
                {socialLoading === "facebook" ? (
                  <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                    </svg>
                    Facebook
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                disabled={socialLoading !== null}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-orange-100 text-sm font-semibold text-gray-800 hover:bg-orange-50 transition-colors disabled:opacity-50 font-body"
              >
                {socialLoading === "apple" ? (
                  <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#111">
                      <path d="M16.365 1.43c0 1.14-.42 2.06-1.26 2.86-.84.8-1.75 1.26-2.9 1.16-.14-1.1.42-2.05 1.24-2.83.83-.79 1.86-1.28 2.92-1.19zM20.6 17.36c-.44 1-1 1.94-1.83 2.83-.9.96-1.79 1.9-3.22 1.92-1.4.03-1.87-.83-3.48-.83-1.62 0-2.13.8-3.46.86-1.4.05-2.44-1.04-3.35-2-1.86-1.98-3.28-5.6-1.37-8.04.94-1.2 2.56-1.96 4.11-1.99 1.36-.03 2.65.9 3.48.9.83 0 2.4-1.11 4.04-.95.69.03 2.62.28 3.86 2.09-.1.06-2.3 1.35-2.28 4.02.02 3.18 2.8 4.24 2.5 4.19z" />
                    </svg>
                    Apple
                  </>
                )}
              </button>
            </div>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-gray-400 font-body">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="font-bold transition-colors"
                style={{ color: "#FF6D00" }}
              >
                {isLogin ? "Sign up" : "Sign In"}
              </button>
            </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sparkle {
          position: absolute;
          color: #ffdf8a;
          filter: drop-shadow(0 0 6px rgba(255, 220, 120, 0.9));
          animation: twinkle 2.4s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}