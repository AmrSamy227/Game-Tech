"use client"

import type React from "react"
import { useAuth, AuthProvider } from "./contexts/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, List, User, LogIn } from "lucide-react"
import AuthModal from "./components/AuthModal"

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  )
}

function NavItemsRenderer({
  navItems,
  currentPage,
  isMobile,
}: {
  navItems: typeof navItems
  currentPage: string
  isMobile: boolean
}) {
  const { user } = useAuth()

  return (
    <>
      {navItems.map((item) => {
        // Hide Lists button if user is not logged in
        if (item.pageKey === "lists" && !user) {
          return null
        }
        return <NavLink key={item.pageKey} {...item} currentPage={currentPage} isMobile={isMobile} />
      })}
    </>
  )
}

// Reusable component for the navigation links
function NavLink({
  name,
  href,
  icon: Icon,
  currentPage,
  pageKey,
  isMobile,
}: {
  name: string
  href: string
  icon: typeof Gamepad2 | typeof List
  currentPage: string
  pageKey: string
  isMobile: boolean
}) {
  const isActive = currentPage === pageKey

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors ${
          isActive ? "text-red-600" : "text-gray-400 hover:text-white"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon size={24} />
        {/* Name is hidden on mobile for tab bar unless you prefer text as well */}
        {/* <span className="text-xs">{name}</span> */}
      </Link>
    )
  }

  // Desktop/Tablet View
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
        isActive ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={18} />
      {name}
    </Link>
  )
}

// Profile link component
function ProfileLink({ currentPage, isMobile }: { currentPage: string; isMobile: boolean }) {
  const { user } = useAuth()
  if (!user) return null
  const isActive = currentPage === "profile"

  if (isMobile) {
    return (
      <Link
        href="/tracker/profile"
        className={`flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors ${
          isActive ? "text-red-600" : "text-gray-400 hover:text-white"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <User size={24} />
        {/* <span className="text-xs">Profile</span> */}
      </Link>
    )
  }

  // Desktop/Tablet View
  return (
    <Link
      href="/tracker/profile"
      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
        isActive ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <User size={18} />
      Profile
    </Link>
  )
}

// AuthButton component for Sign In
function AuthButton() {
  const { user, setShowAuthModal } = useAuth()

  if (user) return null

  return (
    <button
      onClick={() => setShowAuthModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
    >
      <LogIn size={18} />
      Sign In
    </button>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { showAuthModal, setShowAuthModal } = useAuth()
  const pathname = usePathname()
  const currentPage = pathname.includes("lists") ? "lists" : pathname.includes("profile") ? "profile" : "tracker"

  const navItems = [
    { name: "Games", href: "/tracker", icon: Gamepad2, pageKey: "tracker" },
    { name: "Lists", href: "/tracker/lists", icon: List, pageKey: "lists" },
  ]

  return (
    <div className="min-h-screen bg-[#1c1c1c] pb-16 lg:pb-0">
      {/* Mobile Navigation - Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-gray-800 lg:hidden">
        <div className="flex justify-around items-center h-16 max-w-full">
          <NavItemsRenderer navItems={navItems} currentPage={currentPage} isMobile={true} />
          <ProfileLink currentPage={currentPage} isMobile={true} />
        </div>
      </nav>

      {/* Desktop Navigation - Fixed Top Bar */}
      <nav className="hidden lg:block bg-[#111] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"></div>
            <div className="flex gap-4 items-center">
              <NavItemsRenderer navItems={navItems} currentPage={currentPage} isMobile={false} />
              <ProfileLink currentPage={currentPage} isMobile={false} />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area 
          The wrapper div previously here has been removed to allow the content 
          ({children}) to occupy the full viewport width (w-full) and start 
          right below the sticky navigation bar.
      */}
      {children}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}