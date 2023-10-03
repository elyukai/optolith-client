import { useState } from "react"

/**
 * Custom hook that provides state functions tailored for modals.
 */
export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}
