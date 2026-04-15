"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GameDetailPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/tracker")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Redirecting...</p>
    </div>
  )
}
