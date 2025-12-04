"use client";

import React, { useState } from "react";
import { useMyFxBook } from "@/hooks/useMyFxBook";

/**
 * MyFxBook Accounts Component
 * Displays user's trading accounts from MyFxBook
 */
export default function MyFxBookAccounts() {
  const { session, loading, error, getAccounts, isAuthenticated } = useMyFxBook();
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState(null);

  const handleGetAccounts = async () => {
    setAccountsLoading(true);
    setAccountsError(null);
    
    const result = await getAccounts();
    
    if (result.success && result.accounts) {
      setAccounts(result.accounts);
    } else {
      setAccountsError(result.message || "Failed to retrieve accounts");
    }
    
    setAccountsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400">Please login first to view accounts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          MyFxBook Accounts
        </h2>
        <button
          onClick={handleGetAccounts}
          disabled={accountsLoading || loading}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {accountsLoading ? "Loading..." : "Refresh Accounts"}
        </button>
      </div>

      {accountsError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <p className="text-red-400">{accountsError}</p>
        </div>
      )}

      {accounts.length === 0 && !accountsLoading && !accountsError && (
        <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
          <p className="text-neutral-400">No accounts found. Click "Refresh Accounts" to load.</p>
        </div>
      )}

      {accountsLoading && (
        <div className="p-8 text-center">
          <p className="text-neutral-400">Loading accounts...</p>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  account.demo 
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}>
                  {account.demo ? "Demo" : "Live"}
                </span>
              </div>

              {account.description && (
                <p className="text-sm text-neutral-400 mb-3">{account.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Account ID:</span>
                  <span className="text-white font-mono">{account.accountId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Gain:</span>
                  <span className={`font-semibold ${account.gain >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {account.gain}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Balance:</span>
                  <span className="text-white font-semibold">
                    {account.currency} {parseFloat(account.balance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Profit:</span>
                  <span className={`font-semibold ${account.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {account.currency} {parseFloat(account.profit).toLocaleString()}
                  </span>
                </div>
                {account.server && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Server:</span>
                    <span className="text-white">{account.server.name}</span>
                  </div>
                )}
              </div>

              {account.lastUpdateDate && (
                <div className="mt-3 pt-3 border-t border-neutral-700">
                  <p className="text-xs text-neutral-500">
                    Last Update: {account.lastUpdateDate}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

