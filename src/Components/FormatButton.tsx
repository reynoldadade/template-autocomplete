import React from 'react'

interface FormatButtonProps {
  onToggle: (style: string) => void
  active: boolean
  label: string
  style: string
}
export default function FormatButton({ label, style, active, onToggle }: FormatButtonProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <span
      className={`RichEditor-styleButton ${active ? 'RichEditor-activeButton' : ''}`}
      onMouseDown={handleToggle}
    >
      {label}
    </span>
  )
}
