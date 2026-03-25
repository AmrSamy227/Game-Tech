"use client"

import { useState, useEffect, useRef } from "react"
import { Share2, X, Mail, Copy, MessageCircle, Twitter, MessageSquare } from "lucide-react"

const SocialIcon = ({ platform }: { platform: string }) => {
  const base = "w-8 h-8 flex items-center justify-center rounded-full text-white"
  const icons: Record<string, JSX.Element> = {
    WhatsApp: (
      <div className={`${base} bg-green-500`}>
        <MessageCircle size={18} />
      </div>
    ),
    Messenger: (
      <div className={`${base} bg-blue-600`}>
        <MessageSquare size={18} />
      </div>
    ),
    Twitter: (
      <div className={`${base} bg-black`}>
        <Twitter size={18} />
      </div>
    ),
    Reddit: (
      <div className={`${base} bg-orange-600`}>
        <div className="text-xs font-bold">R</div>
      </div>
    ),
    Instagram: (
      <div className={`${base} bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500`}>
        <div className="text-xs font-bold">IG</div>
      </div>
    ),
    TikTok: (
      <div className={`${base} bg-black`}>
        <div className="text-xs font-bold">TT</div>
      </div>
    ),
    Email: (
      <div className={`${base} bg-gray-600`}>
        <Mail size={16} />
      </div>
    ),
    "Copy Link": (
      <div className={`${base} bg-purple-600`}>
        <Copy size={16} />
      </div>
    ),
  }
  return icons[platform] || null
}

interface ShareButtonProps {
  gameTitle: string
  gameUrl: string
  className?: string
}

export default function ShareButton({ gameTitle, gameUrl, className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const message = `🎮 Check out ${gameTitle}\n${gameUrl}`

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: gameTitle,
        text: `Check out ${gameTitle}`,
        url: gameUrl,
      })
    } catch (err) {
      // Share was cancelled or failed
      console.log("Share cancelled or not supported")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${gameTitle}: ${gameUrl}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = `${gameTitle}: ${gameUrl}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const openAppOrCopy = (appUrl: string, fallbackUrl?: string) => {
    const timeout = setTimeout(() => {
      // If we reach here, the app probably isn't installed
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank", "width=600,height=400")
      } else {
        copyToClipboard()
      }
    }, 300)

    // Try to open the app
    window.location.href = appUrl
    
    setTimeout(() => {
      clearTimeout(timeout)
    }, 2000)
  }

  const shareLinks = [
    { 
      name: "WhatsApp", 
      action: () => openAppOrCopy(
        `whatsapp://send?text=${encodeURIComponent(message)}`,
        `https://wa.me/?text=${encodeURIComponent(message)}`
      )
    },
    {
      name: "Messenger",
      action: () => window.open(
        `https://www.facebook.com/dialog/send?app_id=123456789&link=${encodeURIComponent(gameUrl)}&redirect_uri=${encodeURIComponent(window.location.origin)}`,
        "_blank",
        "width=600,height=400"
      )
    },
    {
      name: "Instagram",
      action: () => {
        if (isMobile) {
          openAppOrCopy(
            `instagram://share?text=${encodeURIComponent(message)}`
          )
        } else {
          window.open(
            `https://www.instagram.com/?url=${encodeURIComponent(gameUrl)}`,
            "_blank",
            "width=600,height=400"
          )
        }
      }
    },
    {
      name: "TikTok",
      action: () => {
        if (isMobile) {
          openAppOrCopy("tiktok://")
        } else {
          window.open("https://www.tiktok.com/", "_blank", "width=600,height=400")
        }
      }
    },
    {
      name: "Twitter",
      action: () => window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        "_blank",
        "width=600,height=400"
      )
    },
    {
      name: "Reddit",
      action: () => window.open(
        `https://www.reddit.com/submit?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent(`Check out ${gameTitle}`)}`,
        "_blank",
        "width=600,height=400"
      )
    },
    {
      name: "Email",
      action: () => window.open(
        `mailto:?subject=${encodeURIComponent(`Check out ${gameTitle}`)}&body=${encodeURIComponent(message)}`
      )
    },
    {
      name: "Copy Link",
      action: copyToClipboard
    },
  ]

  const handleShareClick = async () => {
  try {
    // Check if device is mobile and native share API is available
    if (isMobile && typeof navigator.share === "function") {
      await navigator.share({
        title: gameTitle,
        text: `Check out ${gameTitle}`,
        url: gameUrl,
      });
    } else {
      // Fallback: open the custom share dropdown
      setIsOpen(!isOpen);
    }
  } catch (error) {
    console.log("Native share failed or cancelled:", error);
    // Fallback to dropdown if native share fails
    setIsOpen(true);
  }
};


  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
     <button
  onClick={handleShareClick}
  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all duration-200 text-white shadow-lg hover:shadow-xl active:scale-95"
>
  <Share2 size={20} />
  {isCopied ? "Copied!" : "Share Game"}
</button>

      {/* Desktop Share Menu */}
      {!isMobile && isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 z-50 w-72 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
            <h3 className="font-bold text-white text-lg">Share Game</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  link.action()
                  setIsOpen(false)
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-800 transition-all duration-200 group active:scale-95"
              >
                <SocialIcon platform={link.name} />
                <span className="text-xs text-gray-300 group-hover:text-white font-medium">
                  {link.name}
                </span>
              </button>
            ))}
          </div>

          {isCopied && (
            <div className="mt-3 p-2 bg-green-600 text-white text-sm text-center rounded-lg animate-pulse">
              ✅ Link copied to clipboard!
            </div>
          )}
        </div>
      )}
    </div>
  )
}