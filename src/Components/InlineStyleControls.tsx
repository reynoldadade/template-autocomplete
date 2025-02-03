import React from 'react'
import FormatButton from './FormatButton'
import { EditorState, RichUtils } from 'draft-js'

interface InlineStyleControlProps {
  editorState: Draft.EditorState
  onChange: (editorState: EditorState) => void
}
export default function InlineStyleControls({ editorState, onChange }: InlineStyleControlProps) {
  // possible inline styles taking from Draft.js examples
  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
  ]

  // for inline styles getting the style is a bit different from block styles
  const currentStyle = editorState.getCurrentInlineStyle()
  // this function is called when an inline style button is clicked
  function toggleInlineStyle(inlineStyle: string) {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <FormatButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={toggleInlineStyle}
          style={type.style}
        />
      ))}
    </div>
  )
}
