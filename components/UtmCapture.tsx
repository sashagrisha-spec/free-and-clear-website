'use client'

import { useEffect } from 'react'
import { rememberUtm } from '@/lib/utm'

// Renders nothing. Saves the page's UTM so the thank-you page can report it.
export default function UtmCapture() {
  useEffect(() => {
    rememberUtm(new URLSearchParams(window.location.search))
  }, [])
  return null
}
