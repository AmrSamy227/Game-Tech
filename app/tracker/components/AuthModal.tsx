"use client"
import { useState } from "react"
import type React from "react"
import { Mail, Lock, User, Eye, EyeOff, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { user, loading, signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const loginBgImage = "https://wallpaperaccess.com/full/3645178.jpg"
  const signupBgImage = "https://cdn.mos.cms.futurecdn.net/NH6Uhp6NeWyQ2KYJvpK3Ui-1920-80.jpg"

  if (loading) return null
  if (user) {
    onClose()
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, username)
      }
      onClose()
    } catch (err: any) {
      setError(err.message ?? JSON.stringify(err))
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setEmail("")
    setPassword("")
    setUsername("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[520px] max-h-[calc(100vh-2rem)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-red-400 transition-colors md:hidden"
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        {/* Left Panel - Background Image with smooth transition */}
        <div className="w-full md:w-1/2 relative overflow-hidden min-h-[250px] md:min-h-auto order-2 md:order-1">
          <img
            src={isLogin ? loginBgImage : signupBgImage}
            alt="Gaming tracker background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black/60" />

          {/* Content overlay */}
          <div className="relative h-full flex flex-col justify-between p-6 md:p-8 text-white">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Tracker</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 transition-all duration-500">
                {isLogin ? "Welcome Back" : "Start Tracking"}
              </h2>
              <p className="text-red-100 text-xs md:text-sm leading-relaxed">
                {isLogin
                  ? "Manage your gaming library and track your progress."
                  : "Organize, track, and manage your game collection in one place."}
              </p>
            </div>

            {/* Indicators - visible on all screen sizes */}
            <div className="flex justify-center gap-2">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  isLogin ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  !isLogin ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Dark Form */}
        <div className="w-full md:w-1/2 bg-[#1c1c1c] p-4 md:p-10 flex flex-col justify-center order-1 md:order-2 overflow-hidden relative">
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
            aria-label="Close auth modal"
          >
            <X size={20} />
          </button>

          <div className="max-w-sm">
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 transition-all duration-500">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-400 text-xs md:text-sm">
                {isLogin ? "Sign in to your gaming library" : "Start your gaming journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 md:mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-xs md:text-sm"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 md:mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-xs md:text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 md:mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 md:py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all text-xs md:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 md:py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-6 text-xs md:text-sm"
              >
                {submitting ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-2 md:mb-3">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  onClick={toggleMode}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors text-xs md:text-sm"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
