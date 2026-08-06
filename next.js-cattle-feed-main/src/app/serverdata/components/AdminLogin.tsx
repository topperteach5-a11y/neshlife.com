'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/Applogo';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Floating particles state
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess();
      } else {
        setError(data.error || 'Invalid credentials');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError('Network error. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #134e4a 100%)' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(52, 211, 153, ${0.15 + Math.random() * 0.2})`,
              animation: `adminParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
        {/* Large glowing orbs */}
        <div
          className="absolute w-96 h-96 rounded-full"
          style={{
            top: '-10%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
            animation: 'adminOrbPulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            bottom: '-10%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            animation: 'adminOrbPulse 10s ease-in-out 2s infinite',
          }}
        />
      </div>

      {/* Login Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 ${shake ? 'animate-admin-shake' : ''}`}
      >
        {/* Glassmorphism card */}
        <div
          className="rounded-2xl p-8 sm:p-10 shadow-2xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                }}
              >
                <AppLogo size={36} />
              </div>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: '#f1f5f9', fontFamily: 'var(--font-fraunces), serif' }}
            >
              Admin Panel
            </h1>
            <p className="text-sm" style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              NeshLife CattleFeed Management
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                style={{ color: 'rgba(148, 163, 184, 0.9)' }}
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl py-3.5 pl-11 pr-4 text-base font-medium outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    color: '#f1f5f9',
                    fontSize: '16px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                style={{ color: 'rgba(148, 163, 184, 0.9)' }}
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl py-3.5 pl-11 pr-12 text-base font-medium outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    color: '#f1f5f9',
                    fontSize: '16px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                  style={{ color: 'rgba(148, 163, 184, 0.5)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(148, 163, 184, 0.9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(148, 163, 184, 0.5)')}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clipRule="evenodd" />
                      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative rounded-xl py-3.5 text-base font-bold tracking-wide transition-all duration-300 overflow-hidden"
              style={{
                background: isLoading
                  ? 'linear-gradient(135deg, #065f46, #047857)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                boxShadow: isLoading ? 'none' : '0 4px 24px rgba(16, 185, 129, 0.35)',
                fontSize: '16px',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 4px 24px rgba(16, 185, 129, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <p className="text-center text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
              Protected area — Authorized personnel only
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes adminParticleFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-30px) translateX(15px) scale(1.3); opacity: 0.3; }
        }
        @keyframes adminOrbPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-admin-shake {
          animation: adminShake 0.5s ease-in-out;
        }
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
        input::placeholder {
          color: rgba(148, 163, 184, 0.35);
        }
      `}</style>
    </div>
  );
}
