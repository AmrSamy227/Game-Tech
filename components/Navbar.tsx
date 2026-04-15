"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Gamepad2, Home, Mail, Star, List, Calendar, Search, Tag } from "lucide-react"
import SearchAutocomplete from "@/components/SearchAutocomplete"
import CategoriesDropdown from "@/components/CategoriesDropdown"

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen)

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-black sticky top-0 z-50 px-4 sm:px-8 py-3 flex justify-between items-center shadow-lg gap-4">
        {/* Mobile Search Icon */}
        <button
          onClick={toggleMobileSearch}
          className="md:hidden text-white text-2xl hover:text-red-600 transition-colors flex-shrink-0"
        >
          <Search size={24} />
        </button>

        {/* Logo - Left */}
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:scale-105 transition-transform flex-shrink-0 md:flex-shrink-0"
        >
          Game<span className="text-red-600">Tech</span>
        </Link>

        {/* Search Bar - Center (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="w-full max-w-lg">
            <SearchAutocomplete />
          </div>
        </div>

        {/* Navigation and Game Tracker - Right */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <Link href="/" className="text-white hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link href="/contact" className="text-white hover:text-red-600 transition-colors">
            Contact us
          </Link>
          <Link href="/request" className="text-white hover:text-red-600 transition-colors">
            Request Games
          </Link>
          <Link
            href="/tracker"
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold transition-all hover:shadow-lg text-white"
          >
            Game Tracker
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white text-2xl hover:rotate-90 transition-transform flex-shrink-0"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

     {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-black border-b border-red-600/30 px-4 py-3 z-50">
          <SearchAutocomplete />
        </div>
      )}

      {/* Mobile Secondary Navbar */}
      <div className="md:hidden bg-white z-40 shadow-md relative">
        <div className="py-3 flex justify-center gap-4">
          <CategoriesDropdown />
          <Link
            href="/games"
            className="text-red-900/50 font-bold hover:text-red-600 transition-colors text-sm"
          >
            All Games
          </Link>
          <Link
            href="/explore"
            className="text-red-900/50 font-bold hover:text-red-600 transition-colors text-sm"
          >
            Explore
          </Link>
          <Link
            href="/upcoming"
            className="text-red-900/50 font-bold hover:text-red-600 transition-colors text-sm"
          >
            Upcoming
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/30">
          <div className="h-full bg-red-600 progress-bar"></div>
        </div>
      </div>

      

      {/* Secondary Navbar */}
      <div className="hidden md:flex bg-white sticky top-16 z-40 py-3 justify-center gap-8 shadow-md relative">
        <style>{`
          @keyframes loadingBar {
            0% { width: 0; }
            50% { width: 100%; }
            100% { width: 100%; }
          }
          .loading-bar {
            animation: loadingBar 2s ease-in-out infinite;
          }
        `}</style>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/30">
          <div className="h-full bg-red-600 progress-bar"></div>
        </div>

        <Link href="/popular" className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group">
          Popular Games
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
        <Link
          href="/top-rated"
          className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group"
        >
          Top Rated
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
        <CategoriesDropdown />
        <Link href="/games" className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group">
          All Games
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
        <Link href="/explore" className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group">
          Explore
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
        <Link href="/latest" className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group">
          Latest Releases
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
        <Link href="/upcoming" className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group">
          Upcoming Games
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
        </Link>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-white/10 backdrop-blur-md text-white z-50 transition-transform duration-300 shadow-2xl border-r border-white/20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          <Link
            href="/tracker"
            onClick={toggleSidebar}
            className="w-full bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full font-bold transition-all hover:shadow-lg mb-6 block text-center text-white"
          >
            Game Tracker
          </Link>

          <nav className="space-y-2">
            <Link
              href="/"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Home size={20} /> Home
            </Link>
            <Link
              href="/contact"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Mail size={20} /> Contact us
            </Link>
            <Link
              href="/request"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Gamepad2 size={20} /> Request Games
            </Link>
           
            
            <Link
              href="/popular"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Star size={20} /> Popular
            </Link>
            <Link
              href="/top-rated"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Star size={20} /> Top Rated
            </Link>
            
            <Link
              href="/latest"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Calendar size={20} /> Latest Releases
            </Link>
            <Link
              href="/upcoming"
              onClick={toggleSidebar}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-red-600 transition-all border-l-2 border-transparent hover:border-red-600 hover:pl-5 rounded-lg"
            >
              <Calendar size={20} /> Upcoming Games
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
    </>
  )
}
