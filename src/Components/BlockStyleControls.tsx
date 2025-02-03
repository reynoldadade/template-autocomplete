import { EditorState, RichUtils } from 'draft-js'
import React from 'react'
import FormatButton from './FormatButton'

interface BlockStyleControlsProps {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
}

export default function BlockStyleControls({ editorState, onChange }: BlockStyleControlsProps) {
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
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  // this function is called when a block style button is clicked
  function toggleBlockType(blockType: Draft.DraftModel.Constants.DraftBlockType) {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <FormatButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={toggleBlockType}
          style={type.style}
        />
      ))}
    </div>
  )
}
