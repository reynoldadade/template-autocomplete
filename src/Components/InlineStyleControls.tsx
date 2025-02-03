import React from 'react'
import FormatButton from './FormatButton'

interface InlineStyleControlProps {
  editorState: Draft.EditorState
  onToggle: (style: string) => void
}
export default function InlineStyleControls({ editorState, onToggle }: InlineStyleControlProps) {
  // possible inline styles taking from Draft.js examples
  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
  ]

  // for inline styles getting the style is a bit different from block styles
  const currentStyle = editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <FormatButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}
