// In use-media-query.ts
"use client"

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null) // Start with null to indicate loading

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Update the state with the current value
    setMatches(media.matches)
    
    // Create an event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Add the event listener
    media.addEventListener('change', listener)
    
    // Remove the event listener on cleanup
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}