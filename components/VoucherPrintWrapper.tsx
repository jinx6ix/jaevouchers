// components/VoucherPrintWrapper.tsx
'use client'

import { useRef, useEffect } from 'react'

export function VoucherPrintWrapper({ children }: { children: React.ReactNode }) {
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!printRef.current) return

    // Create a clone for PDF generation
    const cloneForPrint = () => {
      const original = printRef.current
      const clone = original.cloneNode(true) as HTMLElement
      
      // Remove any lab() color functions or convert them to RGB/hex
      const allElements = clone.getElementsByTagName('*')
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i] as HTMLElement
        const style = window.getComputedStyle(original.children[i] as Element)
        
        // Copy computed styles (which are already in RGB format)
        el.style.backgroundColor = style.backgroundColor
        el.style.color = style.color
        el.style.borderColor = style.borderColor
      }
      
      return clone
    }

    // Store the clone for PDF generation
    const printClone = cloneForPrint()
    printClone.style.position = 'absolute'
    printClone.style.left = '-9999px'
    document.body.appendChild(printClone)

    return () => {
      printClone.remove()
    }
  }, [])

  return <div ref={printRef}>{children}</div>
}