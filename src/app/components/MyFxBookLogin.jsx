"use client";

import React, { useState } from "react";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import { InteractiveInput } from "@/components/ui/interactive-input";

/**
 * MyFxBook Login Component
 * Demonstrates how to use the MyFxBook API integration
 */
export default function MyFxBookLogin() {
  const { session, loading, error, login, logout, isAuthenticated } = useMyFxBook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useCustomCredentials, setUseCustomCredentials] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (useCustomCredentials && (!email || !password)) {
      alert("Please enter both email and password");
      return;
    }

    const result = await login(
      useCustomCredentials ? email : undefined,
      useCustomCredentials ? password : undefined
    );

    if (result.success) {
      console.log("Login successful! Session:", result.session);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        MyFxBook Login
      </h2>

      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 font-semibold mb-2">✅ Authenticated</p>
            <p className="text-sm text-neutral-300 break-all">
              Session: <span className="font-mono text-xs">{session}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="useCustom"
              checked={useCustomCredentials}
              onChange={(e) => setUseCustomCredentials(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="useCustom" className="text-sm text-neutral-300">
              Use custom credentials
            </label>
          </div>

          {useCustomCredentials && (
            <>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : useCustomCredentials ? "Login with Custom Credentials" : "Login with Default Credentials"}
          </button>
        </form>
      )}
    </div>
  );
}

