import { useState, useEffect } from 'react'

export const useShortenText = (text: string, maxLength: number) => {
  const [shortenedText, setShortenedText] = useState('')

  useEffect(() => {
    if (text.length > maxLength) {
      setShortenedText(text.substring(0, maxLength) + '...')
    } else {
      setShortenedText(text)
    }
  }, [text, maxLength])

  return shortenedText
}
