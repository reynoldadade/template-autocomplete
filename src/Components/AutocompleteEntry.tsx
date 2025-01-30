import React from 'react'

interface AutocompletedEntryProps {
  children: React.ReactNode
}
// Custom Decorator for rendering non-editable "autocompleted entries"
export default function AutocompletedEntry({ children }: AutocompletedEntryProps) {
  return (
    <span
      style={{
        backgroundColor: '#e0e0e0',
        color: 'blue',
        padding: '2px 4px',
        borderRadius: '4px',
      }}
    >
      {children}
    </span>
  )
}
