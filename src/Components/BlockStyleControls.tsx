import { EditorState } from 'draft-js'
import React from 'react'
import FormatButton from './FormatButton'

interface BlockStyleControlsProps {
  editorState: EditorState
  onToggle: (blockType: string) => void
}

export default function BlockStyleControls({ editorState, onToggle }: BlockStyleControlsProps) {
  // possible block types taking from Draft.js examples
  const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
  ]
}
