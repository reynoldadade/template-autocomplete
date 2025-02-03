import { convertFromRaw, EditorState } from 'draft-js'
import React, { useRef } from 'react'

interface SaveButtonProps {
  onChange: (editorState: EditorState) => void
}
export default function SaveButton({ onChange }: SaveButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // 🔹 Load editor content from a saved file
  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const rawContent = JSON.parse(text)
        const contentState = convertFromRaw(rawContent) // Convert JSON back to Draft.js content
        onChange(EditorState.createWithContent(contentState))
      } catch (error) {
        console.error('Failed to load content:', error)
      }
    }

    reader.readAsText(file)
  }
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        title="Load from File"
        onChange={loadFromFile}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        type="button"
        className="Button"
      >
        Load from File
      </button>
    </div>
  )
}
